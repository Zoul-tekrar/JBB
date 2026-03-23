import { API_BASE_URL } from "@/constants/urls";
import {
  BlobSasResponse,
  CreateUploadSasRequest,
  UploadItem,
  UploadToStorageResult,
} from "../upload";

export async function getStorageUrls(payload: CreateUploadSasRequest) {
  const res = await fetch(`${API_BASE_URL}/storage/store`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const toUpload: BlobSasResponse[] = await res.json();
  return toUpload;
}

export async function uploadToStorage(toUpload: UploadItem[]) {
  const bar = toUpload.map(async (tu, i) => {
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
    const uploadResult: UploadToStorageResult = {
      uploadItem: tu,
      response: uploadResponse,
    };

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }

    return uploadResult;
  });

  return await Promise.allSettled(bar);
}
