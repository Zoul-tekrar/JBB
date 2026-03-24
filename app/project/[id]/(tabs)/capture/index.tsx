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
        title="Add note"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/notes",
            params: { id: id },
          })
        }
      ></Button>
      <Button
        title="Photo/Video"
        onPress={() =>
          router.push({
            pathname: "/project/[id]/capture/photo",
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
      <View className="mt-11">
        <Button
          title="Certificates/Reports"
          onPress={() =>
            router.push({
              pathname: "/project/[id]/capture/certificatesreport",
              params: { id: id },
            })
          }
        ></Button>
      </View>
    </View>
  );
}
