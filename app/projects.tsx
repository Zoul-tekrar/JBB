import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const ORANGE = "#E26B2F";
const BLACKJBB = "#111";
const GREYMUTED = "#8A8A8A";
const LINEWHITE = "#E6E6E6";

const PROJECTS = [
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
          <View>
            <Text style={{ fontSize: 22 }}>{item.item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      ></FlatList>
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
    color: BLACKJBB,
    borderColor: ORANGE,
    borderBottomColor: ORANGE,
    borderBottomWidth: 10,
    fontSize: 22,
  },
});
