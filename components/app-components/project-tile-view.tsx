import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colorCodes } from "../ui/colorCodes";

type ProjectTileViewProps = { id?: string; name?: string };

export default function ProjectTileView(props: ProjectTileViewProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/project/[id]/(tabs)/today",
          params: { id: props?.id ?? 0 },
        })
      }
    >
      <View>
        <View style={styles.project_card}>
          <Text style={{ fontSize: 22 }}>{props.name}</Text>
          <Entypo
            style={styles.icon}
            name="chevron-thin-right"
            size={24}
            color="black"
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  projectItem: {},
  icon: {
    color: colorCodes.JBBORANGE,
  },
  project_card: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
});
