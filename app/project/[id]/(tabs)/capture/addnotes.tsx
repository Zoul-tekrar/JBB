import {
  Category,
  SimpleCategoryDropdown,
} from "@/components/app-components/simpleCategoryDropdown";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { API_BASE_URL } from "@/constants/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import z from "zod";

export default function AddNotes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categories: Category[] = [
    { id: 1, name: "Structural Foundation" },
    { id: 2, name: "Framing" },
    { id: 3, name: "Electrical" },
  ];

  const CaptureEntryNoteSchema = z.object({
    categoryId: z.number(),
    shortDescription: z.string().trim().max(50).min(1),
  });

  type CaptureEntry = z.infer<typeof CaptureEntryNoteSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CaptureEntry>({
    resolver: zodResolver(CaptureEntryNoteSchema),
    defaultValues: {
      categoryId: 1,
      shortDescription: "",
    },
  });

  async function onSubmit(formData: CaptureEntry) {
    try {
      const created = await createCaptureEntryNote(formData);
    } catch (e) {}
  }

  async function createCaptureEntryNote(form: CaptureEntry): Promise<void> {
    console.log(Number(id));
    const res = await fetch(`${API_BASE_URL}/captureentry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type: "Note", projectId: Number(id) }),
    });
  }

  return (
    <View>
      <JbbTitle title={"Add notes"}></JbbTitle>
      {errors.categoryId?.message && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.categoryId.message}
        </Text>
      )}
      <Controller
        control={control}
        name="categoryId"
        render={({ field: { onChange, value } }) => (
          <View style={{ gap: 6 }}>
            <Text style={{ opacity: 0.8 }}>Category</Text>
            <SimpleCategoryDropdown
              categories={categories}
              valueId={value}
              onChange={onChange}
            ></SimpleCategoryDropdown>
          </View>
        )}
      ></Controller>

      <View>
        <Text>Notes</Text>
        {errors.shortDescription?.message && (
          <Text className="text-center text-bold text-l text-red-700 font-semibold">
            {errors.shortDescription.message}
          </Text>
        )}
        <Controller
          control={control}
          name="shortDescription"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mt-2 rounded-xl border px-3 py-3"
              value={value}
              onChangeText={onChange}
            ></TextInput>
          )}
        ></Controller>
      </View>
      <Button title="Add note" onPress={handleSubmit(onSubmit)}></Button>
    </View>
  );
}
