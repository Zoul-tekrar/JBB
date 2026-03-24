import { API_BASE_URL } from "@/constants/urls";
import {
  BlobSasResponse,
  CaptureEntryRequest,
  CreateUploadSasRequest,
  MediaCaptureEntryRequest,
  UploadItem,
  UploadToStorageResult,
} from "../upload";

export async function getStorageUrls(payload: CreateUploadSasRequest) {
  const uploadResponse = await fetch(`${API_BASE_URL}/storage/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!uploadResponse.ok) {
    throw new Error(
      `Failed to retrieve storage URLs: ${uploadResponse.status}`,
    );
  }
  const toUpload: BlobSasResponse[] = await uploadResponse.json();
  return toUpload;
}

export async function uploadToStorage(uploadItems: UploadItem[]) {
  const imagesToUpload = uploadItems.map(async (tu) => {
    const imageBody = await fetch(tu.mediaItem.uri);
    const imageBodyAsBlob = await imageBody.blob();

    const uploadResponse = await fetch(tu.blobSas.uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": tu.mediaItem.mediaType ?? "application/octet-stream",
      },
      body: imageBodyAsBlob,
    });
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }
    const uploadResult: UploadToStorageResult = {
      uploadItem: tu,
      response: uploadResponse,
    };

    return uploadResult;
  });

  return await Promise.allSettled(imagesToUpload);
}

export async function insertMediaCaptureEntryRequest(
  photoCaptureEntryRequest: MediaCaptureEntryRequest,
) {
  const uploadResponse = await fetch(`${API_BASE_URL}/captureentry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...photoCaptureEntryRequest,
    }),
  });
  if (!uploadResponse.ok) {
    throw new Error(`Failed to add capture entries ${uploadResponse.status}`);
  }
  console.log(uploadResponse);
}

export async function createCaptureEntryNote(
  form: CaptureEntryRequest,
): Promise<void> {
  const notesSubmissionResponse = await fetch(`${API_BASE_URL}/captureentry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...form }),
  });
  if (!notesSubmissionResponse.ok) {
    throw new Error(
      `Failed to add capture entries ${notesSubmissionResponse.status}`,
    );
  }
}
