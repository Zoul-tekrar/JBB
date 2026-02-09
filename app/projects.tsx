import ProjectTileView from "@/components/app-components/project-tile-view";
import { colorCodes } from "@/components/ui/colorCodes";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Project } from "./domain/project";

const PROJECTS: Project[] = [
  { id: "1", name: "97 Highgams Park" },
  { id: "2", name: "67 Glasslyn Road" },
  { id: "3", name: "30 Voluntary Place" },
  { id: "4", name: "13 Willow Road" },
];

export default function Projects() {
  return (
    <View style={styles.project}>
      <View>
        <Text style={styles.title}>Projects Page</Text>
      </View>

      <FlatList
        data={PROJECTS}
        renderItem={(item) => (
          <ProjectTileView
            id={item.item.id}
            name={item.item.name}
          ></ProjectTileView>
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>

      <View style={styles.project_button}>
        <AntDesign name="plus-square" size={24} color={colorCodes.ORANGE} />
        <Pressable>
          <Text style={styles.project_button_text}>Add Project</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  projectItem: {},
  project: {
    justifyContent: "center",
  },
  title: {
    margin: 40,
    color: colorCodes.ORANGE,
    borderColor: colorCodes.ORANGE,
    borderBottomColor: colorCodes.ORANGE,
    borderBottomWidth: 10,
    fontSize: 22,
  },
  project_button: {
    marginTop: 40,
    flexDirection: "row",
    alignContent: "center",
  },
  project_button_text: {
    fontSize: 22,
    marginLeft: 15,
  },
});
