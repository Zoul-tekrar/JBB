import AddNotes from "@/components/addnotes";
import { JbbTitle } from "@/components/design-components/JbbTitle";
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
import Entypo from "@expo/vector-icons/Entypo";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Control, useForm } from "react-hook-form";
import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { dummyCategories } from "@/data/dummyData";

import { useCaptureMedia } from "@/components/capture/hooks/useCaptureMedia";
import LoadingPage from "@/components/design-components/overlayLoading";
import { showInfo, showSuccess } from "@/components/ui/toast";
import {
  getStorageUrls,
  insertPhotoCaptureEntryRequest,
  uploadToStorage,
} from "@/features/capture/api/storage";
import { getMediaKindFromMime } from "@/features/utils/media";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TakePhotoScreen() {
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

  const images = watch("images");
  const [uploadingState, setUploadingState] = useState<
    "idle" | "uploading" | "submitting" | "retrieving-sas-links"
  >("idle");
  const {
    cameraPermission,
    mediaFilePermission,
    capturePicture,
    captureVideo,
    captureSelectFile,
  } = useCaptureMedia();
  const isBusy = uploadingState !== "idle";

  function updateImages(updatedImages: MediaFileFile[]) {
    showInfo("Added an image");
    setValue("images", [...images, ...updatedImages]);
  }

  const takePicture = async () => {
    const capturedPicture = await capturePicture();
    console.log(capturedPicture);

    if (capturedPicture) {
      updateImages([capturedPicture]);
    }
  };

  const takeVideo = async () => {
    const capturedVideo = await captureVideo();
    if (capturedVideo) {
      updateImages([capturedVideo]);
    }
  };

  const pickFile = async () => {
    const pickedFiles = await captureSelectFile();
    if (pickedFiles) {
      updateImages(pickedFiles);
    }
  };

  async function onSubmitPictures(formData: PhotoEntry) {
    const uploadRequest: CreateUploadSasRequest = {
      projectId: Number(id),
      files: formData.images.map((i) => ({
        contentType: i.mediaType,
      })),
    };
    const imagesFormUpload = formData.images;
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
      type: "photovideo",
      categoryId: formData.categoryId,
      mediaEntries: mediaUploads,
      shortDescription: formData.shortDescription,
    };

    try {
      setUploadingState("submitting");
      await insertPhotoCaptureEntryRequest(photoCaptureEntryRequest);
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
      <View>
        {images.map((i) => (
          <View key={i.uri}>
            <Text>name: {i.name}</Text>
            <Text>uri: {i.uri}</Text>
            <Text>mediaType: {i.mediaType}</Text>
          </View>
        ))}
        <JbbTitle title="Photos"></JbbTitle>
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.images?.message}
          {errors.root?.message}
          {errors.categoryId?.message}
          {errors.shortDescription?.message}
        </Text>
        <Text>Camera</Text>
        <AddNotes
          categories={dummyCategories}
          control={control as unknown as Control<CaptureEntry>}
          errors={errors}
        ></AddNotes>
      </View>

      <View className="mt-4">
        {mediaFilePermission && (
          <View className="my-5 bg-orange-600">
            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={pickFile}
              disabled={uploadingState !== "idle"}
            >
              <MaterialIcons name="attach-file" size={36} color="#f1f1f1" />
            </TouchableOpacity>
          </View>
        )}

        {cameraPermission && (
          <View>
            <View className="bg-orange-600">
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={takePicture}
                disabled={isBusy}
              >
                <Entypo name="camera" size={36} color="#f1f1f1"></Entypo>
              </TouchableOpacity>
            </View>
            <View className="bg-orange-600">
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={takeVideo}
                disabled={isBusy}
              >
                <Entypo name="camera" size={36} color="#f1f1f1"></Entypo>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {images && images.length > 0 && (
          <View>
            <Button
              title="Submit Pictures"
              onPress={handleSubmit(onSubmitPictures)}
              disabled={isBusy}
            ></Button>
          </View>
        )}
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {images.map((i) => (
            <View key={i.uri}>
              <TouchableOpacity
                disabled={isBusy}
                onPress={() => {
                  setValue(
                    "images",
                    images.filter((img) => img !== i),
                  );
                }}
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  right: 0,
                  width: 25,
                  height: 25,
                  zIndex: 1,
                  borderRadius: 12,
                }}
              >
                <Text className="text-x color-white font-extrabold text-center">
                  X
                </Text>
              </TouchableOpacity>
              <Image
                source={{ uri: i.uri }}
                style={{ height: 100, width: 100 }}
              ></Image>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
