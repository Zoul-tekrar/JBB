import { MediaFileFile } from "@/features/capture/api/upload";
import * as ImagePicker from "expo-image-picker";

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
    return await foo("images");
  };

  const captureVideo = async (): Promise<MediaFileFile | null> => {
    return await foo("videos");
  };

  const foo = async (
    mediaType: ImagePicker.MediaType,
  ): Promise<MediaFileFile | null> => {
    const picture = await ImagePicker.launchCameraAsync({
      mediaTypes: mediaType,
    });
    if (picture.canceled || !picture.assets) return null;
    if (picture.assets) {
      const pictureTaken: MediaFileFile = toMediaFileFromImage(
        picture.assets[0],
      );
      return pictureTaken;
    }
    return null;
  };

  return { capturePicture, captureVideo, captureSelectFile };
}
