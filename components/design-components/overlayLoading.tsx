import { ActivityIndicator, Text, View } from "react-native";

export default function LoadingPage({ loadingText }: { loadingText: string }) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.35)",
        zIndex: 999,
        elevation: 999,
      }}
      pointerEvents="auto"
    >
      <View
        style={{
          padding: 20,
          borderRadius: 12,
          backgroundColor: "white",
          alignItems: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator size="large" />
        <Text>{loadingText}</Text>
      </View>
    </View>
  );
}
