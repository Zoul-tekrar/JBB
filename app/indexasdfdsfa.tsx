import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const ORANGE = "#E26B2F";
const BLACK = "#111";
const GREYMUTED = "#8A8A8A";
const LINEWHITE = "#E6E6E6";

export default function LoginScreen() {
  const router = useRouter();
  const [remember, setRemember] = React.useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.welcome}>Welcome!</Text>
        <View style={styles.underline} />

        <View style={styles.form}>
          <TextInput
            placeholder="example@gmail.com"
            placeholderTextColor="#B7B7B7"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <View style={styles.inputLine} />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#B7B7B7"
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.inputLine} />

          <View style={styles.row}>
            <Pressable
              onPress={() => setRemember((v) => !v)}
              style={styles.rememberWrap}
              hitSlop={8}
            >
              <View style={[styles.checkbox, remember && styles.checkboxOn]}>
                {remember ? <View style={styles.checkboxDot} /> : null}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </Pressable>

            <Pressable hitSlop={8} onPress={() => {}}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.loginBtn}
            onPress={() => router.push("/projects")}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </Pressable>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>New member? </Text>
            <Pressable onPress={() => {}} hitSlop={8}>
              <Text style={styles.register}>Register Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    paddingHorizontal: 26,
  },
  card: {
    backgroundColor: "transparent",
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 6,
  },
  underline: {
    width: 56,
    height: 3,
    backgroundColor: ORANGE,
    borderRadius: 2,
    marginBottom: 18,
  },
  form: {
    gap: 10,
  },
  input: {
    fontSize: 14,
    color: BLACK,
    paddingVertical: 10,
  },
  inputLine: {
    height: 1,
    backgroundColor: LINEWHITE,
    marginTop: -6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  rememberWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#CFCFCF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  checkboxOn: {
    borderColor: ORANGE,
  },
  checkboxDot: {
    width: 8,
    height: 8,
    backgroundColor: ORANGE,
    borderRadius: 2,
  },
  rememberText: {
    fontSize: 12,
    color: GREYMUTED,
  },
  forgot: {
    fontSize: 12,
    color: ORANGE,
  },
  loginBtn: {
    marginTop: 18,
    backgroundColor: ORANGE,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 2,
  },
  loginBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  bottomText: {
    fontSize: 12,
    color: GREYMUTED,
  },
  register: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: "600",
  },
});
