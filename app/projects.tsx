import ProjectTileView from "@/components/app-components/project-tile-view";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { colorCodes } from "@/components/ui/colorCodes";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Project } from "./domain/project";

const PROJECTS: Project[] = [
  {
    id: "1",
    name: "97 Highgams Park",
    address: "address",
    createdAt: "createdAt",
    createdByUserId: "1",
  },
  {
    id: "2",
    name: "67 Glasslyn Road",
    address: "address",
    createdAt: "createdAt",
    createdByUserId: "1",
  },
  {
    id: "3",
    name: "30 Voluntary Place",
    address: "address",
    createdAt: "createdAt",
    createdByUserId: "1",
  },
  {
    id: "4",
    name: "13 Willow Road",
    address: "address",
    createdAt: "createdAt",
    createdByUserId: "1",
  },
];

export default function Projects() {
  return (
    <View style={styles.project}>
      <JbbTitle title="Projects"></JbbTitle>

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

      <Pressable>
        <View style={{ ...styles.add_project }}>
          <View>
            <AntDesign
              name="plus-square"
              size={24}
              color={colorCodes.JBBORANGE}
            />
          </View>
          <View>
            <Text style={styles.project_button_text}>Add Project</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  project: {
    justifyContent: "center",
    marginHorizontal: 70,
  },

  add_project: {
    marginTop: 40,
    flexDirection: "row",
  },
  project_button_text: {
    marginLeft: 10,
    fontSize: 22,
  },
});
