import AddNotes from "@/components/addnotes";
import ImageHorizontalDisplay from "@/components/design-components/imageHorizontalDisplay";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { API_BASE_URL } from "@/constants/urls";
import { dummyCategories } from "@/data/dummyData";
import {
  BlobSasResponse,
  CaptureEntry,
  MediaCaptureEntryRequest,
  MediaEntry,
  MediaEntrySchema,
  MediaFile,
  MediaUploads,
} from "@/features/capture/upload";
import Entypo from "@expo/vector-icons/Entypo";
import { zodResolver } from "@hookform/resolvers/zod";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useGlobalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { Button, Pressable, Text, View } from "react-native";

export default function IncidentReport() {
  const {
    control,
    handleSubmit,

    watch,
    setValue,
    formState: { errors },
  } = useForm<MediaEntry>({
    resolver: zodResolver(MediaEntrySchema),
    defaultValues: {
      categoryId: 1,
      shortDescription: "",
      mediaFiles: [],
    },
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const { id } = useGlobalSearchParams<{ id: string }>();
  const pickImage = async function () {
    const { granted } = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (!granted) return;
    const imageSelected = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: "images",
    });
    if (imageSelected.canceled || imageSelected.assets.length === 0) return;

    const medFiles: MediaFile[] = imageSelected.assets.map(toMediaFile) ?? [];

    updateMediaFiles([...mediaFiles, ...medFiles]);
  };

  const pickFile = async function () {
    const fileResult = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (fileResult.canceled) return;

    const medFiles: MediaFile[] = fileResult.assets?.map(toMediaFile) ?? [];

    updateMediaFiles([...mediaFiles, ...medFiles]);
  };

  const takePicture = async () => {
    const picture = await ImagePicker.launchCameraAsync();
    if (picture.canceled) return;
    const medFiles = picture.assets?.map(toMediaFile) ?? [];

    updateMediaFiles([...mediaFiles, ...medFiles]);
  };

  function updateMediaFiles(mediaFiles: MediaFile[]) {
    setMediaFiles(mediaFiles);
    setValue(
      "mediaFiles",
      mediaFiles.map((mf) => mf.uri),
    );
  }

  async function onSubmit(formData: MediaEntry) {
    console.log(mediaFiles);

    let payload = {
      files: mediaFiles.map((mf) => ({ contentType: mf.mimeType })),
      projectId: Number(id),
    };

    const res = await fetch(`${API_BASE_URL}/storage/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const toUpload: BlobSasResponse[] = await res.json();
    let uploadUrl = toUpload[0].uploadUrl;

    for (let i = 0; i < toUpload.length; i++) {
      const response = await fetch(mediaFiles[i].uri);
      const body = await response.blob();
      await fetch(toUpload[i].uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": "image/jpeg",
        },
        body: body,
      });
    }

    const mediaUploads = toUpload.map((u) => {
      let m: MediaUploads = {
        blobName: u.blobName,
        mediaType: mediaFiles[toUpload.indexOf(u)].mimeType ?? "unknown",
      };
      return m;
    });

    const photoCaptureEntryRequest: MediaCaptureEntryRequest = {
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

    //NO wrong scenario.
  }

  return (
    <View>
      <View className="bg-green-700"></View>
      <JbbTitle title={"Certificates Reports"}></JbbTitle>
      <Text className="text-center text-bold text-l text-red-700 font-semibold">
        {errors.mediaFiles?.message}
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
            updateMediaFiles(mf);
          }}
        ></ImageHorizontalDisplay>
      </View>
      <View>
        <Text>Files Uploaded</Text>
        {mediaFiles
          .filter(
            (mf) => mf.mimeType !== "image/jpeg" && mf.mimeType !== "image/png",
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
                  setMediaFiles((mf) => mf.filter((fi) => fi.uri !== i.uri));
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

function toMediaFile(asset: {
  uri: string;
  name?: string;
  mimeType?: string;
}): MediaFile {
  return {
    uri: asset.uri,
    name: asset.name ?? "file",
    mimeType: asset.mimeType,
  };
}
