import { JbbTitle } from "@/components/design-components/JbbTitle";
import { router } from "expo-router";
import { Button, View } from "react-native";

export default function Capture() {
  return (
    <View>
      <JbbTitle title="Capture Menu"></JbbTitle>
      <Button
        title="Test"
        onPress={() => router.push("/project/[id]/(tabs)/capture")}
      ></Button>
    </View>
  );
}
