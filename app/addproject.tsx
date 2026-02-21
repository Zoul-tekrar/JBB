import { JbbTitle } from "@/components/design-components/JbbTitle";
import { projectSchema } from "@/data/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { ProjectDto } from "../dtos/dtos";

export default function AddProject() {
  const API_BASE_URL = "https://localhost:7243";

  type ProjectForm = z.infer<typeof projectSchema>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      address: "",
      notes: "",
    },
  });

  const { replace } = useRouter();

  async function onSubmit(data: ProjectForm) {
    try {
      const created = await createProject(data);
      console.log(created);
      replace({
        pathname: "/project/[id]/(tabs)/today",
        params: { id: created.id },
      });
    } catch (e) {}
  }

  async function createProject(form: ProjectForm): Promise<ProjectDto> {
    const res = await fetch(`${API_BASE_URL}/project`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} : ${text}`);
    }
    const createdProject: ProjectDto = await res.json();
    return createdProject;
  }

  return (
    <View>
      <JbbTitle title={"Add Project"} />
      <Text className="text-xl text-center">Project name</Text>
      {errors.name?.message && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.name.message}
        </Text>
      )}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mt-2 rounded-xl border px-3 py-3"
            value={value}
            onChangeText={onChange}
          ></TextInput>
        )}
      ></Controller>

      <Text className="text-xl text-center">Project Address</Text>
      {errors.address?.message && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.address?.message}
        </Text>
      )}
      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mt-2 rounded-xl border px-3 py-3"
            value={value}
            onChangeText={onChange}
          ></TextInput>
        )}
      ></Controller>

      <Text className="text-xl text-center">Notes(optional)</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className={`mt-2 rounded-xl border px-3 py-3`}
            value={value}
            onChangeText={onChange}
          ></TextInput>
        )}
      ></Controller>

      <View className="mt-10">
        <Button
          title="Add new project"
          onPress={handleSubmit(onSubmit)}
        ></Button>
      </View>
    </View>
  );
}
