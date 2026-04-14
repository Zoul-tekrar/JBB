import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { View } from "react-native";
import Toast from "react-native-toast-message";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey!} tokenCache={tokenCache}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Stack></Stack>
        <StatusBar style="auto" />
        <Toast />
      </View>
    </ClerkProvider>
  );
}
