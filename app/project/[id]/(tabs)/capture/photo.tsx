import AddNotes from "@/components/addnotes";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { API_BASE_URL } from "@/constants/urls";
import { dummyCategories } from "@/data/dummyData";
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
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Control, useForm } from "react-hook-form";
import {
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Preview = { uri: string } | null;

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
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isCapturing, setIsCapturing] = useState(false);

  const [open, setOpen] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  const [lastPhoto, setLastPhoto] = useState<Preview>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const takePicture = async () => {
    setIsCapturing(true);
    if (cameraRef) {
      try {
        const data = await cameraRef.current?.takePictureAsync();
        if (data && data.uri) {
          setValue("images", [...images, data.uri], { shouldValidate: true });
        }
      } catch (e) {
        console.log(e);
      }
    }
    setIsCapturing(false);
  };

  if (!permission) {
    return (
      <View>
        <Text>Loading permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>Camera access needed</Text>
        <Text>To capture jobsite photos, allow camera permission.</Text>

        <Pressable onPress={requestPermission}>
          <Text>Allow Camera</Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text>Go Back</Text>
        </Pressable>
      </View>
    );
  }

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
      <View style={{ flex: 1 }}>
        <JbbTitle title="Photo"></JbbTitle>
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.images?.message}
          {errors.root?.message}
          {errors.categoryId?.message}
          {errors.shortDescription?.message}
        </Text>
        <Text>Camera</Text>
        <CameraView
          flash={flash}
          facing={facing}
          ref={cameraRef}
          style={{ flex: 1 }}
        ></CameraView>
      </View>

      <View className="bg-red-950">
        <View>
          <Text className="text-center text-bold text-l text-red-700 font-semibold">
            {errors.images?.message}
            {errors.root?.message}
            {errors.categoryId?.message}
            {errors.shortDescription?.message}
          </Text>
          <Button title="Add Notes" onPress={() => setOpen(true)}></Button>
        </View>
        <View>
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
            onPress={takePicture}
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
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable onPress={() => setOpen(false)}>
          <Text className="text-xl">Close</Text>
        </Pressable>
        <AddNotes
          categories={dummyCategories}
          control={control as unknown as Control<CaptureEntry>}
          errors={errors}
        ></AddNotes>
        <View className="mt-10">
          <Button title="Save" onPress={() => setOpen(false)}></Button>
        </View>
      </Modal>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {images.map((i) => (
            <View key={i}>
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
                source={{ uri: i }}
                style={{ height: 100, width: 100 }}
              ></Image>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
