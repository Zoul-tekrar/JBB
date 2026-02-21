import { JbbTitle } from "@/components/design-components/JbbTitle";
import { router } from "expo-router";
import { Button, View } from "react-native";

import "../../../../../global.css";

export default function Capture() {
  return (
    <View>
      <JbbTitle title="Capture Menu"></JbbTitle>
      <Button
        title="Photo"
        onPress={() => router.push("/project/[id]/capture/photo")}
      ></Button>

      <Button
        title="Video Walkthrough"
        onPress={() => router.push("/project/[id]/capture/video")}
      ></Button>

      <Button
        title="Audio Notes"
        onPress={() => router.push("/project/[id]/capture/audionotes")}
      ></Button>

      <Button
        title="Report Issue/Incident"
        onPress={() => router.push("/project/[id]/capture/incident-report")}
      ></Button>
      <Button
        title="Add note"
        onPress={() => router.push("/project/[id]/(tabs)/capture/addnotes")}
      ></Button>
      <Button
        title="Certificates/Reports"
        onPress={() => router.push("/project/[id]/capture/incident-report")}
      ></Button>
    </View>
  );
}
