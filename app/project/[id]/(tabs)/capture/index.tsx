import { JbbTitle } from "@/components/design-components/JbbTitle";
import { router, useGlobalSearchParams } from "expo-router";
import { Button, View } from "react-native";

import "../../../../../global.css";

export default function Capture() {
  const { id } = useGlobalSearchParams<{ id: string }>();
  return (
    <View>
      <JbbTitle title="Capture Menu"></JbbTitle>
      <Button
        title="Photo"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/photo",
            params: { id: id },
          })
        }
      ></Button>

      <Button
        title="Video Walkthrough"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/video",
            params: { id: id },
          })
        }
      ></Button>

      <Button
        title="Audio Notes"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/audionotes",
            params: { id: id },
          })
        }
      ></Button>

      <Button
        title="Report Issue/Incident"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/incident-report",
            params: { id: id },
          })
        }
      ></Button>
      <Button
        title="Add note"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/notes",
            params: { id: id },
          })
        }
      ></Button>
      <Button
        title="Certificates/Reports"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/incident-report",
            params: { id: id },
          })
        }
      ></Button>
    </View>
  );
}
