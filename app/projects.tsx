import ProjectTileView from "@/components/app-components/project-tile-view";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { colorCodes } from "@/components/ui/colorCodes";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ProjectDto } from "./dtos/dtos";

const API_BASE_URL = "https://localhost:7243";

export default function Projects() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectDto[]>();
  useFocusEffect(
    useCallback(() => {
      const loadProjects = async () => {
        try {
          const projects = await getProjects();
          setProjects(projects);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to load projects");
        } finally {
          setLoading(false);
        }
      };
      loadProjects();
    }, []),
  );

  async function getProjects(): Promise<ProjectDto[]> {
    const res = await fetch(`${API_BASE_URL}/project`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} : ${text}`);
    }

    const createdProjects: ProjectDto[] = await res.json();

    console.log(createdProjects);

    return createdProjects;
  }

  return (
    <View style={styles.project}>
      <JbbTitle title="Projects"></JbbTitle>

      {loading && <Text className="text-lg">Loading...</Text>}
      {error && <Text className="text-red-700 font-semibold">{error}</Text>}

      <FlatList<ProjectDto>
        data={projects}
        renderItem={({ item }) => (
          <ProjectTileView
            id={item.id.toString()}
            name={item.name}
          ></ProjectTileView>
        )}
        keyExtractor={(item) => item.id.toString()}
      ></FlatList>

      <Pressable onPress={() => router.push("/addproject")}>
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
