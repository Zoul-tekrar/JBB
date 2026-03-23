import AddNotes from "@/components/addnotes";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { API_BASE_URL } from "@/constants/urls";
import {
  BlobSasResponse,
  CaptureEntry,
  CreateUploadSasRequest,
  MediaFileFile,
  MediaUploads,
  PhotoCaptureEntryRequest,
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
import { showError, showInfo } from "@/components/ui/toast";
import {
  getStorageUrls,
  uploadToStorage,
} from "@/features/capture/api/storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TakePhotoScreen() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
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
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const {
    cameraPermission,
    mediaFilePermission,
    capturePicture,
    captureVideo,
    captureSelectFile,
  } = useCaptureMedia();

  function updateImages(foo: MediaFileFile[]) {
    showInfo("Added an image");
    if (foo) {
      setValue("images", [...images, ...foo]);
    }
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
    const toUpload: BlobSasResponse[] = await getStorageUrls(uploadRequest);

    try {
      setIsUploading(true);
      const foo: UploadItem[] = toUpload.map((tu, i) => ({
        blobSas: { blobName: tu.blobName, uploadUrl: tu.uploadUrl },
        mediaItem: images[i],
      }));

      const uploadingResults = await uploadToStorage(foo);

      uploadingResults.forEach((v, index) => {
        if (v.status === "rejected") {
          showError(`Couldn't upload actually ${v.reason}`);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
      }
      console.log(error);
    } finally {
      setIsUploading(false);
    }

    const mediaUploads = toUpload.map((u) => {
      let m: MediaUploads = {
        blobName: u.blobName,
        mediaType: "photo",
      };
      return m;
    });

    const photoCaptureEntryRequest: PhotoCaptureEntryRequest = {
      categoryId: formData.categoryId,
      mediaEntries: mediaUploads,
      shortDescription: formData.shortDescription,
    };

    await fetch(`${API_BASE_URL}/captureentry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...photoCaptureEntryRequest,
        projectId: Number(id),
        type: "Photo",
      }),
    });
    // NO wrong scenario right now. Finish this after

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
      {isUploading && <LoadingPage loadingText="Uploading"></LoadingPage>}
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
        <View>
          <Text className="text-center text-bold text-l text-red-700 font-semibold">
            {errors.images?.message}
            {errors.root?.message}
            {errors.categoryId?.message}
            {errors.shortDescription?.message}
          </Text>
        </View>
        {mediaFilePermission && (
          <View className="my-5 bg-orange-600">
            <TouchableOpacity
              style={{ alignItems: "center", justifyContent: "center" }}
              onPress={pickFile}
              disabled={isCapturing}
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
                disabled={isCapturing}
              >
                <Entypo name="camera" size={36} color="#f1f1f1"></Entypo>
              </TouchableOpacity>
            </View>
            <View className="bg-orange-600">
              <TouchableOpacity
                style={{ alignItems: "center", justifyContent: "center" }}
                onPress={takeVideo}
                disabled={isCapturing}
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
            ></Button>
          </View>
        )}
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {images.map((i) => (
            <View key={i.uri}>
              <TouchableOpacity
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
