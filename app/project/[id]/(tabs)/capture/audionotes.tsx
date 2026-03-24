import AddNotes from "@/components/addnotes";
import AudioPreview from "@/components/app-components/audio/audioPreview";
import { dummyCategories } from "@/data/dummyData";
import {
  BlobSasResponse,
  CaptureEntry,
  CreateUploadSasRequest,
  MediaCaptureEntryRequest,
  MediaFileFile,
  MediaUploads,
  PhotoEntry,
  PhotoEntrySchema,
  UploadItem,
} from "@/features/capture/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";

import { useAudioCapture } from "@/components/capture/hooks/useAudioCapture";
import { showSuccess } from "@/components/ui/toast";
import {
  getStorageUrls,
  insertMediaCaptureEntryRequest,
  uploadToStorage,
} from "@/features/capture/api/storage";
import { getMediaKindFromMime } from "@/features/utils/media";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import "../../../../../global.css";

export default function AudioNotes() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<PhotoEntry>({
    resolver: zodResolver(PhotoEntrySchema),
    defaultValues: {
      categoryId: 1,
      shortDescription: "",
      images: [],
    },
  });
  const { id } = useLocalSearchParams<{ id: string }>();
  const [uploadingState, setUploadingState] = useState<
    "idle" | "uploading" | "submitting" | "retrieving-sas-links"
  >("idle");
  const {
    audioPermission,
    recording,
    duration,
    audioState,
    startRecording,
    stopRecording,
  } = useAudioCapture();
  const audioUri = watch("images");

  async function beginRecording() {
    await startRecording();
    setValue("images", []);
  }

  async function endRecording() {
    await stopRecording();
    if (recording)
      updateImages([
        {
          uri: recording.getURI() ?? "",
          mediaType: "audio/mp4",
          name: "cached-audio",
        },
      ]);
  }

  async function saveRecording(formData: PhotoEntry) {
    let uploadRequest: CreateUploadSasRequest = {
      files: [{ contentType: "audio/m4a" }],
      projectId: Number(id),
    };

    let toUpload: BlobSasResponse[] = [];
    try {
      setUploadingState("retrieving-sas-links");
      toUpload = await getStorageUrls(uploadRequest);
    } catch (error) {
      console.error(error);
      setError("images", {
        type: "server",
        message:
          "Something went wrong while retrieving SAS links from the server",
      });
      setUploadingState("idle");
      return;
    }

    const uploadAudioItem: UploadItem[] = [
      {
        blobSas: toUpload[0],
        mediaItem: formData.images[0],
      },
    ];

    try {
      setUploadingState("uploading");
      const uploadingResults = await uploadToStorage(uploadAudioItem);
      if (uploadingResults.some((ur) => ur.status === "rejected")) {
        setError("images", {
          type: "server",
          message: "Upload failed. Please try again.",
        });
        setUploadingState("idle");
        return;
      }
    } catch (error) {
      console.error(error);
      setError("images", {
        type: "server",
        message: "Upload failed, try again.",
      });
      setUploadingState("idle");
      return;
    }

    const mediaUpload: MediaUploads = {
      blobName: uploadAudioItem[0].blobSas.blobName,
      mediaType: getMediaKindFromMime(uploadAudioItem[0].mediaItem.mediaType),
    };

    const photoCaptureEntryRequest: MediaCaptureEntryRequest = {
      projectId: Number(id),
      type: "audio",
      categoryId: formData.categoryId,
      mediaEntries: [mediaUpload],
      shortDescription: formData.shortDescription,
    };
    try {
      setUploadingState("submitting");
      await insertMediaCaptureEntryRequest(photoCaptureEntryRequest);
    } catch (err) {
      setError("root", {
        message: "Submission failed",
      });
      console.error(err);
      setUploadingState("idle");
      return;
    }

    showSuccess("Submitted capture entries successfully");
    router.replace({
      pathname: "/project/[id]/capture",
      params: { id },
    });
  }

  return (
    <View className="flex-1">
      <View>
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.images?.root?.message}
        </Text>
        <AddNotes
          categories={dummyCategories}
          control={control as unknown as Control<CaptureEntry>}
          errors={errors}
        ></AddNotes>

        <Text>{duration}s</Text>
        {audioUri[0] && <AudioPreview uri={audioUri[0].uri}></AudioPreview>}
        <View>
          <Button
            title={audioState !== "recording" ? "Record" : "Stop"}
            onPress={recording ? endRecording : beginRecording}
          ></Button>
        </View>
      </View>

      {audioUri && (
        <View className="mt-11">
          <Button
            onPress={handleSubmit(saveRecording)}
            title="Save Recording"
          />
        </View>
      )}
    </View>
  );
  function updateImages(updatedImages: MediaFileFile[]) {
    setValue("images", [...audioUri, ...updatedImages]);
  }
}
