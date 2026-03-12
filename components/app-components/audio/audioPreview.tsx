import { JbbTitle } from "@/components/design-components/JbbTitle";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function AudioPreview({ uri }: { uri: string }) {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  const barColor = isPlaying ? "orange" : "gray";

  useEffect(() => {
    let mounted = true;
    let createdSound: Audio.Sound | null = null;

    async function loadSound() {
      const { sound: newSound } = await Audio.Sound.createAsync(
        {
          uri,
        },
        { shouldPlay: false },
      );
      createdSound = newSound;

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!mounted || !status.isLoaded) return;
        setIsLoaded(true);
        setIsPlaying(status.isPlaying);
        setPositionMillis(status.positionMillis ?? 0);
        setDurationMillis(status.durationMillis ?? 0);
      });

      const status = await newSound.getStatusAsync();
      if (mounted && status.isLoaded) {
        setIsLoaded(true);
        setIsPlaying(status.isPlaying);
        setPositionMillis(status.positionMillis ?? 0);
        setDurationMillis(status.durationMillis ?? 0);
      }

      setSound(newSound);
    }
    loadSound();

    return () => {
      mounted = false;
      if (createdSound) {
        createdSound.unloadAsync();
      }
    };
  }, [uri]);

  async function togglePlayback() {
    if (!sound || !isLoaded) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }

  async function restartPlayback() {
    if (!sound || !isLoaded) return;
    await sound.setPositionAsync(0);
    await sound.playAsync();
  }

  return (
    <View>
      <JbbTitle title={"Audio"}></JbbTitle>

      <View className="flex items-center justify-center mt-6">
        <View className="bg-gray-600 w-2/12 rounded-full p-3 flex-row items-center">
          <Pressable onPress={restartPlayback}>
            <MaterialCommunityIcons name="restart" size={24} color="black" />
          </Pressable>

          <Pressable onPress={togglePlayback}>
            <AntDesign
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={24}
              color={barColor}
            />
          </Pressable>
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
          <MaterialIcons name="multitrack-audio" size={24} color={barColor} />
        </View>
        <View>
          <Text>
            {formatTime(positionMillis)} / {formatTime(durationMillis)}
          </Text>
        </View>
      </View>
    </View>
  );
}
