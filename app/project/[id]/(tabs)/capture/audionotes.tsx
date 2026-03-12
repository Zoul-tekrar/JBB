import AddNotes from "@/components/addnotes";
import AudioPreview from "@/components/app-components/audio/audioPreview";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import "../../../../../global.css";

export default function AudioNotes() {
  const [permission, setPermission] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioState, setAudioState] = useState<
    "idle" | "recording" | "stopped" | "uploading"
  >("idle");
  const [audioUri, setAudioUri] = useState<string | null>(null);

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
    setAudioUri(null);
    recording.setOnRecordingStatusUpdate((status) => {
      setDuration(status.durationMillis ?? 0);
    });
    setRecording(recording);
  }

  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setAudioState("stopped");
    setAudioUri(recording.getURI());
    setRecording(null);
  }

  return (
    <View className="flex-1">
      <View>
        <AddNotes></AddNotes>

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
          <Button title="Save Recording" />
        </View>
      )}
    </View>
  );
}
