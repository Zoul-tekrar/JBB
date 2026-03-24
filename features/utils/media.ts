import { MediaType } from "@/domain/project";

export function getMediaKindFromMime(mimeType?: string): MediaType {
  if (!mimeType) return "document";

  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";

  return "document";
}
