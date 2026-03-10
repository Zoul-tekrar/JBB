import { MediaType } from "@/domain/project";
import { z } from "zod";

export const CaptureEntryNoteSchema = z.object({
  categoryId: z.number(),
  shortDescription: z.string().trim().max(50).min(1),
});

export type CaptureEntry = z.infer<typeof CaptureEntryNoteSchema>;

export const PhotoEntrySchema = CaptureEntryNoteSchema.extend({
  images: z.array(z.string()).min(1),
});

export type PhotoEntry = z.infer<typeof PhotoEntrySchema>;
export type BlobSasResponse = {
  blobName: string;
  uploadUrl: string;
};

export type MediaUploads = {
  blobName: string;
  mediaType: MediaType;
};

export type PhotoCaptureEntryRequest = CaptureEntry & {
  mediaEntries: MediaUploads[];
};
