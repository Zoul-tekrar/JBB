import { FakeMapBox } from "@/components/design-components/fake-map-box";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { colorCodes } from "@/components/ui/colorCodes";
import { dummyActivityLogs } from "@/data/dummyData";
import { ProjectDto } from "@/dtos/dtos";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityLog } from "../../../../domain/project";

const API_BASE_URL = "https://localhost:7243";

export type ProjectDetailVM = {
  project: ProjectDto;
  activityLogs: ActivityLog[];
};

export default function ProjectId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailVM | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadProjects = async () => {
        try {
          const project = await getProject();
          const projectvm: ProjectDetailVM = {
            project: project,
            activityLogs: dummyActivityLogs,
          };
          setProject(projectvm);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to load projects");
        } finally {
          setLoading(false);
        }
      };
      loadProjects();
    }, []),
  );

  async function getProject(): Promise<ProjectDto> {
    const res = await fetch(`${API_BASE_URL}/project/${id}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} : ${text}`);
    }

    const project: ProjectDto = await res.json();

    console.log(project);

    return project;
  }

  return (
    <View>
      <JbbTitle title={project?.project.name ?? "loading..."}></JbbTitle>
      <View style={{ marginTop: 50 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{}}>
            <Text style={{ fontSize: 24 }}>{new Date().toDateString()}</Text>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24 }}>
              12°C
              <Fontisto
                name="day-sunny"
                size={24}
                color={colorCodes.JBBORANGE}
              />
            </Text>
          </View>
        </View>
      </View>
      <FakeMapBox></FakeMapBox>
      {/* The list */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {project?.activityLogs.map((log) => (
          <View
            key={log.id}
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: colorCodes.JBBLINEWHITE,
              marginTop: 20,
              borderRadius: 8,
              height: 50,
              alignItems: "center",
            }}
          >
            <View>
              <Text style={{ fontSize: 16 }}>{log.createdAt}: </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={{ fontSize: 16 }} ellipsizeMode="tail">
                {log.displayMessage}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
