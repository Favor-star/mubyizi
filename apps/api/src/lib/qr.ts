import { createHmac, timingSafeEqual } from "node:crypto";
import QRCode from "qrcode";

export interface QrPayload {
  workplaceId: string;
  date: string; // ISO date string YYYY-MM-DD
  exp: number;  // Unix timestamp (ms)
}

const getSecret = (): string => {
  const secret = process.env.QR_SECRET;
  if (!secret) throw new Error("QR_SECRET environment variable is not set");
  return secret;
};

const sign = (payload: object): string => {
  const data = JSON.stringify(payload);
  return createHmac("sha256", getSecret()).update(data).digest("hex");
};

export const generateQrToken = (workplaceId: string, date?: string): string => {
  const targetDate = date ?? new Date().toISOString().slice(0, 10);
  // Expires at end of the target day (23:59:59.999)
  const expDate = new Date(`${targetDate}T23:59:59.999Z`);
  const exp = expDate.getTime();

  const payload: QrPayload = { workplaceId, date: targetDate, exp };
  const sig = sign(payload);
  const token = Buffer.from(JSON.stringify({ ...payload, sig })).toString("base64url");
  return token;
};

export const verifyQrToken = (token: string): QrPayload | null => {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    const { sig, ...payload } = decoded as QrPayload & { sig: string };

    if (!sig || !payload.workplaceId || !payload.date || !payload.exp) return null;

    // Check expiry
    if (Date.now() > payload.exp) return null;

    // Verify signature
    const expectedSig = sign(payload);
    const sigBuffer = Buffer.from(sig, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (sigBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(sigBuffer, expectedBuffer)) return null;

    return payload;
  } catch {
    return null;
  }
};

export const generateQrImage = async (token: string): Promise<string> => {
  return QRCode.toDataURL(token);
};
