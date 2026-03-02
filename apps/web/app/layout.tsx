import { Geist, Geist_Mono, Roboto } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/shared/components/providers";
import { Metadata } from "next";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});
export const metadata: Metadata = {
  title: "Mubyizi",
  description: "Mubyizi is a platform for sharing and discovering music."
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={roboto.variable}>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased  `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
