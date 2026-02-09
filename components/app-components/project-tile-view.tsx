import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet, Text, View } from "react-native";
import { colorCodes } from "../ui/colorCodes";

type ProjectTileViewProps = { id: string; name: string };

export default function ProjectTileView(props: ProjectTileViewProps) {
  return (
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
