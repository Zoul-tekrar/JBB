import { MediaFile } from "@/features/capture/api/upload";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  mediaFiles: MediaFile[];
  setMediaFiles: (mediaFiles: MediaFile[]) => void;
};

export default function imageHorizontalDisplay(props: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      {props.mediaFiles
        .filter(
          (i) => i.mimeType === "image/jpeg" || i.mimeType === "image/png",
        )
        .map((i) => (
          <View key={i.name}>
            <TouchableOpacity
              onPress={() => {
                props.setMediaFiles(
                  props.mediaFiles.filter((fi) => fi.uri !== i.uri),
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
  );
}
