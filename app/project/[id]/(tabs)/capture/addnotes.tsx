import AddNotes from "@/components/addnotes-refactor";
import { Category } from "@/components/app-components/simpleCategoryDropdown";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import { API_BASE_URL } from "@/constants/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { Button, View } from "react-native";
import z from "zod";

const CaptureEntryNoteSchema = z.object({
  categoryId: z.number(),
  shortDescription: z.string().trim().max(50).min(1),
});

export type CaptureEntry = z.infer<typeof CaptureEntryNoteSchema>;

export default function Notes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categories: Category[] = [
    { id: 1, name: "Structural Foundation" },
    { id: 2, name: "Framing" },
    { id: 3, name: "Electrical" },
  ];

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
      <AddNotes
        categories={categories}
        control={control}
        errors={errors}
      ></AddNotes>
      <Button title="Add note" onPress={handleSubmit(onSubmit)}></Button>
    </View>
  );
}
