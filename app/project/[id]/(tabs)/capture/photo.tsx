import AddNotes from "@/components/addnotes";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { API_BASE_URL } from "@/constants/urls";
import {
  BlobSasResponse,
  CaptureEntry,
  MediaUploads,
  PhotoCaptureEntryRequest,
  PhotoEntry,
  PhotoEntrySchema,
} from "@/features/capture/api/upload";
import Entypo from "@expo/vector-icons/Entypo";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCameraPermissions } from "expo-camera";
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

import { useCaptureMedia } from "@/components/hooks/capture/useCaptureMedia";
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
  const [permission, requestPermission] = useCameraPermissions();
  const images = watch("images");
  const [isCapturing, setIsCapturing] = useState(false);
  const { capturePicture, captureVideo, captureSelectFile } = useCaptureMedia();

  const takePicture = async () => {
    const capturedPicture = await capturePicture();
    if (capturedPicture) {
      setValue("images", [...images, capturedPicture]);
    }
  };

  const takeVideo = async () => {
    const capturedVideo = await captureVideo();
    if (capturedVideo) {
      setValue("images", [...images, capturedVideo]);
    }
  };

  const pickFile = async () => {
    const pickedFiles = await captureSelectFile();
    if (pickedFiles) {
      setValue("images", [...images, ...pickedFiles]);
    }
  };

  async function onSubmitPictures(formData: PhotoEntry) {
    const payload = {
      files: formData.images.map((i) => ({ contentType: "image/jpeg" })),
      projectId: Number(id),
    };

    const res = await fetch(`${API_BASE_URL}/storage/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const toUpload: BlobSasResponse[] = await res.json();

    for (let i = 0; i < toUpload.length; i++) {
      let uploadUrl = toUpload[i].uploadUrl;

      const imageBody = await fetch(images[i]);
      const imageBodyAsBlob = await imageBody.blob();

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": "image/jpeg",
        },
        body: imageBodyAsBlob,
      });
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

  return (
    <View style={{ flex: 1 }}>
      <View>
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
        <View className="my-5 bg-orange-600">
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
            onPress={pickFile}
            disabled={isCapturing}
          >
            <MaterialIcons name="attach-file" size={36} color="#f1f1f1" />
          </TouchableOpacity>
        </View>

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
