import AddNotes from "@/components/addnotes";
import { JbbTitle } from "@/components/design-components/JbbTitle";
import LoadingPage from "@/components/design-components/overlayLoading";
import { showSuccess } from "@/components/ui/toast";
import { dummyCategories } from "@/data/dummyData";
import { createCaptureEntryNote } from "@/features/capture/api/storage";
import {
  CaptureEntry,
  CaptureEntryNoteSchema,
  CaptureEntryRequest,
} from "@/features/capture/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, View } from "react-native";

export default function Notes() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pageState, setPageState] = useState<"idle" | "submitting">("idle");
  const isBusy = pageState !== "idle";

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CaptureEntry>({
    resolver: zodResolver(CaptureEntryNoteSchema),
    defaultValues: {
      categoryId: 1,
      shortDescription: "",
    },
  });

  async function onSubmit(formData: CaptureEntry) {
    const captureEntryRequest: CaptureEntryRequest = {
      projectId: Number(id),
      categoryId: formData.categoryId,
      shortDescription: formData.shortDescription,
      type: "note",
    };
    try {
      setPageState("submitting");
      await createCaptureEntryNote(captureEntryRequest);
    } catch (error) {
      console.error(error);
      setError("root", {
        type: "server",
        message: "Failed to save note. Please try again.",
      });
      return;
    } finally {
      setPageState("idle");
    }

    showSuccess("Note added succesfully");
    router.replace({
      pathname: "/project/[id]/capture",
      params: { id },
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <JbbTitle title={"Add note"}></JbbTitle>
      {pageState === "submitting" && (
        <LoadingPage loadingText="Submitting Notes"></LoadingPage>
      )}
      <AddNotes
        categories={dummyCategories}
        control={control}
        errors={errors}
      ></AddNotes>
      <Button
        disabled={isBusy}
        title="Add note"
        onPress={handleSubmit(onSubmit)}
      ></Button>
    </View>
  );
}
