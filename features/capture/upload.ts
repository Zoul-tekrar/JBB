import { CaptureType, MediaType } from "@/domain/project";
import { z } from "zod";

export const CaptureEntryNoteSchema = z.object({
  categoryId: z.number(),
  shortDescription: z.string().trim().max(50).min(1),
});

export type CaptureEntry = z.infer<typeof CaptureEntryNoteSchema>;

export const MediaUploadSchema = z.object({
  uri: z.string(),
  name: z.string(),
  mediaType: z.string(),
});
export const PhotoEntrySchema = CaptureEntryNoteSchema.extend({
  images: z.array(MediaUploadSchema),
});

export const AudioEntrySchema = CaptureEntryNoteSchema.extend({
  audioUri: z.string().trim().min(10).nullable(),
});

export const MediaEntrySchema = CaptureEntryNoteSchema.extend({
  mediaFiles: z.array(z.string().min(2)).min(1),
});

export type PhotoEntry = z.infer<typeof PhotoEntrySchema>;

export type AudioEntry = z.infer<typeof AudioEntrySchema>;

export type MediaEntry = z.infer<typeof MediaEntrySchema>;

export type MediaFile = { uri: string; name: string; mimeType?: string };

export type MediaFileFile = z.infer<typeof MediaUploadSchema>;

export type BlobSasResponse = {
  blobName: string;
  uploadUrl: string;
};

export type MediaUploads = {
  blobName: string;
  mediaType: MediaType;
};

export type CreateUploadSasRequest = {
  projectId: number;
  files: MediaInformation[];
};

export type MediaInformation = {
  contentType: string;
};

export type MediaCaptureEntryRequest = CaptureEntry & {
  projectId: number;
  type: CaptureType;
  mediaEntries: MediaUploads[];
};

export type AudioCaptureEntryRequest = CaptureEntry & {
  mediaEntries: MediaUploads[];
};

export type MediaPermissionState = "undetermined" | "granted" | "denied";

export type UploadItem = {
  mediaItem: MediaFileFile;
  blobSas: BlobSasResponse;
};

export type UploadToStorageResult = {
  uploadItem: UploadItem;
  response: Response;
};
