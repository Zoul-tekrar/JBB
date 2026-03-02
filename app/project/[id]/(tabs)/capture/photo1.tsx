import { JbbTitle } from "@/components/design-components/JbbTitle";
import Entypo from "@expo/vector-icons/Entypo";
import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type Preview = { uri: string } | null;

export default function TakePhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [images, setImages] = useState<string[]>([]);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraRef = useRef<CameraView | null>(null);

  const [lastPhoto, setLastPhoto] = useState<Preview>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const takePicture = async () => {
    setIsCapturing(true);
    if (cameraRef) {
      try {
        const data = await cameraRef.current?.takePictureAsync();
        if (data && data.uri) {
          setImages([...images, data.uri]);
          console.log(data.uri);
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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <JbbTitle title="Photo"></JbbTitle>
        <Text>Camera</Text>
        <CameraView
          flash={flash}
          facing={facing}
          ref={cameraRef}
          style={{ flex: 1 }}
        ></CameraView>
      </View>

      <View className="bg-red-950">
        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
          onPress={takePicture}
          disabled={isCapturing}
        >
          <Entypo name="camera" size={28} color="#f1f1f1"></Entypo>
        </TouchableOpacity>
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          {images.map((i) => (
            <View key={i}>
              <TouchableOpacity
                onPress={() => {
                  setImages((prev) => prev.filter((img) => img !== i));
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
