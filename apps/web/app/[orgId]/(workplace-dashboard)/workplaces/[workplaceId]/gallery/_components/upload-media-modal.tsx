"use client";
import React from "react";
import {
  IconCloudUpload,
  IconFileTypeJpg,
  IconHemisphere,
  IconMovie,
  IconPhoto,
  IconPlus,
  IconVideo,
  IconX
} from "@tabler/icons-react";
import { DialogWrapper } from "@/shared/components/dialog-wrapper";
import { Button } from "@workspace/ui/components/button";
import { DialogFooter } from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle
} from "@workspace/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { Badge } from "@workspace/ui/components/badge";
import type { TradeCategory, MediaType } from "../../_components/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockFile {
  id: string;
  name: string;
  size: string;
  type: "image" | "video";
}

// ─── Mock queued files ────────────────────────────────────────────────────────

const INITIAL_FILES: MockFile[] = [
  { id: "1", name: "site-photo-01.jpg", size: "2.4 MB", type: "image" },
  { id: "2", name: "walkthrough.mp4", size: "48.1 MB", type: "video" },
  { id: "3", name: "panorama-360.jpg", size: "11.7 MB", type: "image" }
];

const TRADE_CATEGORIES: { value: TradeCategory; label: string }[] = [
  { value: "concrete", label: "Concrete Work" },
  { value: "framing", label: "Framing" },
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" }
];

const MEDIA_TYPES: { value: MediaType; label: string; description: string; icon: React.ElementType }[] = [
  { value: "photo", label: "Photo", description: "JPG, PNG, HEIC", icon: IconPhoto },
  { value: "video", label: "Video", description: "MP4, MOV, AVI", icon: IconVideo },
  { value: "360", label: "360°", description: "Equirectangular image", icon: IconHemisphere }
];

// ─── File row ─────────────────────────────────────────────────────────────────

function FileRow({ file, onRemove }: { file: MockFile; onRemove: () => void }) {
  const Icon = file.type === "video" ? IconMovie : IconFileTypeJpg;
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-background group hover:bg-muted/30 transition-colors">
      <div className="h-8 w-8 rounded shrink-0 bg-muted flex items-center justify-center text-muted-foreground">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{file.name}</p>
        <p className="text-[10px] text-muted-foreground">{file.size}</p>
      </div>
      <Badge variant="outline" className="text-[10px] h-5 shrink-0">
        {file.type === "video" ? "video" : "image"}
      </Badge>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onRemove}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10">
        <IconX size={12} />
      </Button>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function AddMediaModal() {
  const [files, setFiles] = React.useState<MockFile[]>(INITIAL_FILES);
  const [tradeCategory, setTradeCategory] = React.useState<TradeCategory>("concrete");
  const [mediaType, setMediaType] = React.useState<MediaType>("photo");
  const [caption, setCaption] = React.useState("");

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <DialogWrapper
      trigger={
        <Button size="lg" variant="outline">
          <IconPlus />
          Add media
        </Button>
      }
      title="Add media to gallery"
      description="Upload photos, videos, or 360° captures to this workplace's gallery.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Left: drop zone + file list ── */}
        <div className="space-y-3">
          {/* Drop zone */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <IconCloudUpload size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">Drop files here or browse</p>
              <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, MP4, 360° — up to 100 MB each</p>
            </div>
            <Button variant="outline" size="sm" className="mt-1">
              Browse files
            </Button>
          </div>

          {/* Queued files */}
          {files.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">Queued files</p>
                <Badge variant="secondary" className="text-xs h-5">
                  {files.length}
                </Badge>
              </div>
              {files.map((file) => (
                <FileRow key={file.id} file={file} onRemove={() => removeFile(file.id)} />
              ))}
            </div>
          )}

          {files.length === 0 && (
            <p className="text-xs text-center text-muted-foreground py-2">
              No files queued. Add files using the drop zone above.
            </p>
          )}
        </div>

        {/* ── Right: metadata fields ── */}
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Media details</FieldLegend>
            <FieldDescription>These details will apply to all uploaded files.</FieldDescription>
            <FieldSeparator />
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="media-trade">Trade category</FieldLabel>
                <Select value={tradeCategory} onValueChange={(v) => setTradeCategory(v as TradeCategory)}>
                  <SelectTrigger id="media-trade" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {TRADE_CATEGORIES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>The construction phase these files belong to.</FieldDescription>
              </Field>

              <FieldSeparator />

              <Field>
                <FieldLabel>Media type</FieldLabel>
                <FieldDescription>What kind of media are you uploading?</FieldDescription>
                <RadioGroup
                  value={mediaType}
                  onValueChange={(v) => setMediaType(v as MediaType)}
                  className="grid-cols-1 sm:grid-cols-3">
                  {MEDIA_TYPES.map(({ value, label, description, icon: Icon }) => (
                    <FieldLabel key={value} htmlFor={`mt-${value}`}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            <Icon size={14} />
                            {label}
                          </FieldTitle>
                          <FieldDescription>{description}</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem value={value} id={`mt-${value}`} />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
              </Field>

              <FieldSeparator />

              <Field>
                <FieldLabel htmlFor="media-caption">Caption</FieldLabel>
                <Input
                  id="media-caption"
                  placeholder="e.g. Foundation pour — north section"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <FieldDescription>Optional short description shown in the gallery.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </div>

      <DialogFooter className="mt-6">
        <p className="text-sm text-muted-foreground mr-auto">
          {files.length === 0 ? (
            "No files selected"
          ) : (
            <>
              <span className="font-medium text-foreground">{files.length}</span> file{files.length !== 1 ? "s" : ""}{" "}
              ready to upload
            </>
          )}
        </p>
        <Button disabled={files.length === 0}>
          Upload {files.length > 0 ? `${files.length} file${files.length !== 1 ? "s" : ""}` : "files"}
        </Button>
      </DialogFooter>
    </DialogWrapper>
  );
}
