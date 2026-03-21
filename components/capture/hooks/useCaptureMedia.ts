import {
  MediaFileFile,
  MediaPermissionState,
} from "@/features/capture/api/upload";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

type Params = {};

function toMediaFileFromImage(
  pickerMedia: ImagePicker.ImagePickerAsset,
): MediaFileFile {
  return {
    name: pickerMedia.fileName ?? "",
    mediaType: pickerMedia.mimeType ?? "",
    uri: pickerMedia.uri,
  };
}

export function useCaptureMedia() {
  useEffect(() => {
    getCameraPermission();
    getLibraryPermission();
  }, []);

  const [cameraPermission, setCameraPermission] =
    useState<MediaPermissionState>("undetermined");
  const [mediaFilePermission, setMediaFilePermission] =
    useState<MediaPermissionState>("undetermined");

  const getCameraPermission = async () => {
    const result = await ImagePicker.getCameraPermissionsAsync();
    setCameraPermission(result.granted ? "granted" : "denied");
    return result.granted;
  };

  const getLibraryPermission = async () => {
    const result = await ImagePicker.getMediaLibraryPermissionsAsync();
    setMediaFilePermission(result.granted ? "granted" : "denied");
    return result.granted;
  };

  const captureSelectFile = async (): Promise<MediaFileFile[] | null> => {
    const fileResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      allowsMultipleSelection: true,
    });
    if (fileResult.canceled || !fileResult.assets) return null;
    if (fileResult.assets) {
      return fileResult.assets.map(toMediaFileFromImage);
    }
    return null;
  };

  const capturePicture = async (): Promise<MediaFileFile | null> => {
    return await captureMedia("images");
  };

  const captureVideo = async (): Promise<MediaFileFile | null> => {
    return await captureMedia("videos");
  };

  const captureMedia = async (
    mediaType: ImagePicker.MediaType,
  ): Promise<MediaFileFile | null> => {
    const picture = await ImagePicker.launchCameraAsync({
      mediaTypes: mediaType,
    });
    if (picture.canceled || !picture.assets?.length) return null;
    const pictureTaken: MediaFileFile = toMediaFileFromImage(picture.assets[0]);
    return pictureTaken;
  };

  return {
    cameraPermission,
    mediaFilePermission,
    capturePicture,
    captureVideo,
    captureSelectFile,
  };
}
