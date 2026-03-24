import AddNotes from "@/components/addnotes";
import AudioPreview from "@/components/app-components/audio/audioPreview";
import { dummyCategories } from "@/data/dummyData";
import {
  AudioEntry,
  AudioEntrySchema,
  BlobSasResponse,
  CaptureEntry,
  MediaCaptureEntryRequest,
  MediaUploads,
} from "@/features/capture/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";

import { API_BASE_URL } from "@/constants/urls";
import { router, useLocalSearchParams } from "expo-router";
import "../../../../../global.css";

export default function AudioNotes() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AudioEntry>({
    resolver: zodResolver(AudioEntrySchema),
    defaultValues: {
      categoryId: 1,
      shortDescription: "",
      audioUri: "",
    },
  });
  const { id } = useLocalSearchParams<{ id: string }>();
  const [permission, setPermission] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioState, setAudioState] = useState<
    "idle" | "recording" | "stopped" | "uploading"
  >("idle");
  const audioUri = watch("audioUri");

  useEffect(() => {
    async function requestPermission() {
      setPermission((await Audio.requestPermissionsAsync()).granted);
    }

    requestPermission();
  }, []);

  async function startRecording() {
    if (!permission) return;
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();
    setAudioState("recording");
    setValue("audioUri", null);
    recording.setOnRecordingStatusUpdate((status) => {
      setDuration(status.durationMillis ?? 0);
    });
    setRecording(recording);
  }

  async function saveRecording(formData: AudioEntry) {
    if (!audioUri) return;

    let payload = {
      files: [{ contentType: "audio/m4a" }],
      projectId: Number(id),
    };
    const res = await fetch(`${API_BASE_URL}/storage/store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const toUpload: BlobSasResponse[] = await res.json();
    let uploadUrl = toUpload[0].uploadUrl;

    const audioBody = await fetch(audioUri);
    const imageBodyAsBlob = await audioBody.blob();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": "image/jpeg",
      },
      body: imageBodyAsBlob,
    });

    const mediaUploads = toUpload.map((u) => {
      let m: MediaUploads = {
        blobName: u.blobName,
        mediaType: "audio",
      };
      return m;
    });

    const photoCaptureEntryRequest: MediaCaptureEntryRequest = {
      categoryId: formData.categoryId,
      mediaEntries: mediaUploads,
      shortDescription: formData.shortDescription,
    };

    await fetch(`${API_BASE_URL}/captureentry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...photoCaptureEntryRequest,
        projectId: Number(id),
        type: "Audio",
      }),
    });
    // NO wrong scenario, no loaders, bare minimum right now. A bit duplication also
    router.replace({
      pathname: "/project/[id]/capture",
      params: { id },
    });
  }

  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setAudioState("stopped");
    setValue("audioUri", recording.getURI());
    console.log();
    setRecording(null);
  }

  return (
    <View className="flex-1">
      <View>
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.audioUri?.message}
        </Text>
        <AddNotes
          categories={dummyCategories}
          control={control as unknown as Control<CaptureEntry>}
          errors={errors}
        ></AddNotes>

        <Text>{duration}s</Text>
        {audioUri && <AudioPreview uri={audioUri}></AudioPreview>}
        <View>
          <Button
            title={audioState !== "recording" ? "Record" : "Stop"}
            onPress={recording ? stopRecording : startRecording}
          ></Button>
        </View>
      </View>

      {audioUri && (
        <View className="mt-11">
          <Button
            onPress={handleSubmit(saveRecording)}
            title="Save Recording"
          />
        </View>
      )}
    </View>
  );
}
