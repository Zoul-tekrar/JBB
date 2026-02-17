import { JbbTitle } from "@/components/design-components/JbbTitle";
import { Button, Text, TextInput, View } from "react-native";

import { projectSchema } from "@/data/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export default function AddProject() {
  type ProjectForm = z.infer<typeof projectSchema>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      projectAddress: "",
      notes: "",
    },
  });

  function onSubmit(data: ProjectForm) {
    //Make call to api to save the data
  }

  return (
    <View>
      <JbbTitle title={"Add Project"} />
      <Text className="text-xl text-center">Project name</Text>
      {errors.projectName?.message && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.projectName.message}
        </Text>
      )}
      <Controller
        control={control}
        name="projectName"
        render={({ field: { onChange, value } }) => (
          <TextInput
            className="mt-2 rounded-xl border px-3 py-3"
            value={value}
            onChangeText={onChange}
          ></TextInput>
        )}
      ></Controller>

      <Text className="text-xl text-center">Project Address</Text>
      {errors.projectAddress?.message && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.projectAddress?.message}
        </Text>
      )}
      <Controller
        control={control}
        name="projectAddress"
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
