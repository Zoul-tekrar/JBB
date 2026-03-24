import { MediaPermissionState } from "@/features/capture/upload";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export function useAudioCapture() {
  useEffect(() => {
    async function requestPermission() {
      setAudioPermission(
        (await Audio.requestPermissionsAsync()).granted ? "granted" : "denied",
      );
    }
    requestPermission();
  }, []);

  const [audioPermission, setAudioPermission] =
    useState<MediaPermissionState>("undetermined");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioState, setAudioState] = useState<
    "idle" | "recording" | "stopped" | "uploading"
  >("idle");

  async function startRecording() {
    if (!audioPermission) return;
    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY,
    );
    await recording.startAsync();
    setAudioState("recording");
    recording.setOnRecordingStatusUpdate((status) => {
      setDuration(status.durationMillis ?? 0);
    });
    setRecording(recording);
  }

  async function stopRecording() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    setAudioState("stopped");
    console.log();
    setRecording(null);
  }

  return {
    audioPermission,
    recording,
    duration,
    audioState,
    startRecording,
    stopRecording,
  };
}
