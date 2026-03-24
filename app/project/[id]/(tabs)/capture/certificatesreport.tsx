import AddNotes from "@/components/addnotes";
import { useCaptureMedia } from "@/components/capture/hooks/useCaptureMedia";
import ImageHorizontalDisplay from "@/components/design-components/imageHorizontalDisplay";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import LoadingPage from "@/components/design-components/overlayLoading";
import { showInfo, showSuccess } from "@/components/ui/toast";
import { dummyCategories } from "@/data/dummyData";
import {
  getStorageUrls,
  insertMediaCaptureEntryRequest,
  uploadToStorage,
} from "@/features/capture/api/storage";
import {
  BlobSasResponse,
  CaptureEntry,
  CreateUploadSasRequest,
  MediaCaptureEntryRequest,
  MediaEntry,
  MediaEntrySchema,
  MediaFileFile,
  MediaUploads,
  UploadItem,
} from "@/features/capture/upload";
import { getMediaKindFromMime } from "@/features/utils/media";
import Entypo from "@expo/vector-icons/Entypo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useGlobalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { Button, Pressable, Text, View } from "react-native";

export default function IncidentReport() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<MediaEntry>({
    resolver: zodResolver(MediaEntrySchema),
    defaultValues: {
      categoryId: 1,
      shortDescription: "",
      images: [],
    },
  });

  const [uploadingState, setUploadingState] = useState<
    "idle" | "uploading" | "submitting" | "retrieving-sas-links"
  >("idle");

  const {
    cameraPermission,
    mediaFilePermission,
    capturePicture,
    capturePicturesFromLibrary,
    captureDocumentsFromLibrary,
  } = useCaptureMedia();

  const mediaFiles = watch("images");

  const { id } = useGlobalSearchParams<{ id: string }>();
  const pickImage = async function () {
    const medFiles = await capturePicturesFromLibrary();
    if (medFiles) {
      updateImages(medFiles);
    }
  };

  const takePicture = async () => {
    const capturedPicture = await capturePicture();
    console.log(capturedPicture);

    if (capturedPicture) {
      updateImages([capturedPicture]);
    }
  };

  const pickFile = async function () {
    const medFiles = await captureDocumentsFromLibrary();
    if (medFiles) updateImages(medFiles);
  };

  function updateImages(updatedImages: MediaFileFile[]) {
    showInfo("Added an image");
    setValue("images", [...mediaFiles, ...updatedImages]);
  }

  async function onSubmit(formData: MediaEntry) {
    const uploadRequest: CreateUploadSasRequest = {
      projectId: Number(id),
      files: formData.images.map((i) => ({
        contentType: i.mediaType,
      })),
    };

    const imagesFormUpload = formData.images;
    let toUpload: BlobSasResponse[];

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

    const uploadMediaItems: UploadItem[] = toUpload.map((tu, i) => ({
      blobSas: { blobName: tu.blobName, uploadUrl: tu.uploadUrl },
      mediaItem: imagesFormUpload[i],
    }));

    try {
      setUploadingState("uploading");

      const uploadingResults = await uploadToStorage(uploadMediaItems);
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

    const mediaUploads = uploadMediaItems.map((u) => {
      let m: MediaUploads = {
        blobName: u.blobSas.blobName,
        mediaType: getMediaKindFromMime(u.mediaItem.mediaType),
      };
      return m;
    });

    const photoCaptureEntryRequest: MediaCaptureEntryRequest = {
      projectId: Number(id),
      type: "certificate",
      categoryId: formData.categoryId,
      mediaEntries: mediaUploads,
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

  if (cameraPermission !== "granted" && mediaFilePermission !== "granted") {
    return (
      <View>
        <Text>You dont have permissions...</Text>
      </View>
    );
  }
  if (
    cameraPermission === "undetermined" &&
    mediaFilePermission === "undetermined"
  ) {
    return (
      <View>
        <Text>Retrieving Permissions...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {uploadingState === "uploading" && (
        <LoadingPage loadingText="Uploading"></LoadingPage>
      )}
      {uploadingState === "submitting" && (
        <LoadingPage loadingText="Submitting"></LoadingPage>
      )}
      {uploadingState === "retrieving-sas-links" && (
        <LoadingPage loadingText="Retrieving SAS links"></LoadingPage>
      )}
      <View className="bg-green-700"></View>
      <JbbTitle title={"Certificates Reports"}></JbbTitle>
      <Text className="text-center text-bold text-l text-red-700 font-semibold">
        {errors.images?.root?.message}
      </Text>
      <AddNotes
        categories={dummyCategories}
        control={control as unknown as Control<CaptureEntry>}
        errors={errors}
      ></AddNotes>
      <View className="bg-orange-600 py-3 mt-4">
        <Button title="Take photo" onPress={takePicture}></Button>
        <View className="mt-11">
          <Button title="Choose photos" onPress={pickImage}></Button>
          <Button title="Choose files" onPress={pickFile}></Button>
        </View>
      </View>
      <View className="bg-red-600">
        <Text>Photos</Text>
        <ImageHorizontalDisplay
          mediaFiles={mediaFiles}
          setMediaFiles={(mf) => {
            setValue("images", mf);
          }}
        ></ImageHorizontalDisplay>
      </View>
      <View>
        <Text>Files Uploaded</Text>
        {mediaFiles
          .filter(
            (mf) =>
              mf.mediaType !== "image/jpeg" && mf.mediaType !== "image/png",
          )
          .map((i) => (
            <View
              className="bg-orange-500 mt-3 rounded-3xl py-2 flex-row justify-between"
              key={i.uri}
            >
              <Text className="text-lg ml-3">
                <Entypo name="documents" size={24} color="black" />
                {i.name}
              </Text>
              <Pressable
                className="mr-3"
                onPress={() => {
                  setValue(
                    "images",
                    mediaFiles.filter((fi) => fi.uri !== i.uri),
                  );
                }}
              >
                <Text className="text-center text-xl w-6 bg-red-700">X</Text>
              </Pressable>
            </View>
          ))}
      </View>
      <View className="mt-11">
        <Button onPress={handleSubmit(onSubmit)} title="Submit" />
      </View>
    </View>
  );
}
