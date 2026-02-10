import { FakeMapBox } from "@/components/design-components/fake-map-box";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { colorCodes } from "@/components/ui/colorCodes";
import { dummyActivityLogs, dummyProject } from "@/data/dummyData";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityLog, Project } from "../../../domain/project";

export type ProjectDetailVM = {
  project: Project;
  activityLogs: ActivityLog[];
};

export const dummyProjectDetail: ProjectDetailVM = {
  project: dummyProject,
  activityLogs: dummyActivityLogs,
};

export default function ProjectId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetailVM | null>(null);

  useEffect(() => {
    setProject(dummyProjectDetail);
  });

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
