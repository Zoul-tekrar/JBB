import { CaptureType, MediaType } from "@/domain/project";
import { z } from "zod";

export const MediaUploadSchema = z.object({
  uri: z.string(),
  name: z.string(),
  mediaType: z.string(),
});

export const CaptureEntryNoteSchema = z.object({
  categoryId: z.number(),
  shortDescription: z.string().trim().max(50).min(1),
});

export const MediaEntrySchema = CaptureEntryNoteSchema.extend({
  images: z.array(MediaUploadSchema),
});

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

export type CaptureEntry = z.infer<typeof CaptureEntryNoteSchema>;

export type CaptureEntryRequest = CaptureEntry & {
  projectId: number;
  type: CaptureType;
};

export type MediaCaptureEntryRequest = CaptureEntryRequest & {
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
