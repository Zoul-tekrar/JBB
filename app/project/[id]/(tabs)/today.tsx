import { FakeMapBox } from "@/components/design-components/fake-map-box";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import LoadingPage from "@/components/design-components/overlayLoading";
import { colorCodes } from "@/components/ui/colorCodes";
import { API_BASE_URL } from "@/constants/urls";
import { ProjectDto } from "@/dtos/dtos";
import { ActivityLogDto } from "@/features/today/dtos";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export type ProjectDetailVM = {
  projectDetail: ProjectDto;
  activityLogs: ActivityLogDto[];
};

export default function ProjectId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [projectVm, setProjectVm] = useState<ProjectDetailVM | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProject = async () => {
        setError(null);
        setLoading(true);
        try {
          const project = await getProject();
          const projectvm: ProjectDetailVM = {
            projectDetail: project,
            activityLogs: (await getActivityLogs()) ?? [],
          };
          setProjectVm(projectvm);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to load project");
        } finally {
          setLoading(false);
        }
      };
      loadProject();
    }, [id]),
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

  async function getActivityLogs(): Promise<ActivityLogDto[]> {
    const res = await fetch(`${API_BASE_URL}/activitylog/${id}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} : ${text}`);
    }

    return res.json();
  }

  return (
    <View>
      <JbbTitle
        title={projectVm?.projectDetail.name ?? "loading..."}
      ></JbbTitle>
      {loading && <LoadingPage loadingText="Loading..."></LoadingPage>}
      {error && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {error}
        </Text>
      )}

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
        {projectVm && projectVm.activityLogs.length > 0 ? (
          projectVm?.activityLogs?.map((log) => (
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
                <Text style={{ fontSize: 16 }}>
                  {new Date(log.createdAt).toLocaleTimeString()}:{" "}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text
                  style={{ fontSize: 16 }}
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {log.activityMessage} to {log.category}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text>No activity yet</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
