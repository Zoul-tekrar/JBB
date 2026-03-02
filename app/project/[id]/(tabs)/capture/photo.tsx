import {
  CameraType,
  CameraView,
  FlashMode,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

type Preview = { uri: string } | null;

export default function TakePhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [isCapturing, setIsCapturing] = useState(false);

  const [lastPhoto, setLastPhoto] = useState<Preview>(null);
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    // Optional: if id is missing, you can guard. (Handy with routing bugs.)
    if (!id) {
      // don’t hard-crash; just show a friendly message.
      // You can remove this once your routing is stable.
      console.warn("TakePhotoScreen: missing project id param.");
    }
  }, [id]);

  useEffect(() => {
    if (!showSavedToast) return;
    const t = setTimeout(() => setShowSavedToast(false), 1200);
    return () => clearTimeout(t);
  }, [showSavedToast]);

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const cycleFlash = () => {
    setFlash((prev) => {
      // off -> on -> auto -> off
      if (prev === "off") return "on";
      if (prev === "on") return "auto";
      return "off";
    });
  };

  const flashLabel = (mode: FlashMode) => {
    if (mode === "off") return "Flash Off";
    if (mode === "on") return "Flash On";
    return "Flash Auto";
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    if (isCapturing) return;

    try {
      setIsCapturing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        // If you want exif for GPS/time etc, set exif: true (bigger payload).
        exif: false,
      });

      if (!photo?.uri) throw new Error("No photo uri returned");

      setLastPhoto({ uri: photo.uri });
      setShowSavedToast(true);

      // TODO: persist to your capture flow:
      // - upload to backend
      // - or store locally + attach to CaptureEntry
      // - include projectId = id
      // Example:
      // await uploadCapture({ projectId: id, uri: photo.uri, type: "photo" });
    } catch (e: any) {
      Alert.alert("Couldn’t take photo", e?.message ?? "Unknown error");
    } finally {
      setIsCapturing(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionBody}>
          To capture jobsite photos, allow camera permission.
        </Text>

        <Pressable style={styles.primaryBtn} onPress={requestPermission}>
          <Text style={styles.primaryBtnText}>Allow Camera</Text>
        </Pressable>

        <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
          <Text style={styles.secondaryBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        ref={(r) => (cameraRef.current = r)}
        style={styles.camera}
        facing={facing}
        flash={flash}
      />

      {/* Top bar overlay */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>←</Text>
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>Take Photo</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            Project: {id ?? "—"}
          </Text>
        </View>

        <View style={styles.topRight}>
          <Pressable onPress={cycleFlash} style={styles.pillBtn}>
            <Text style={styles.pillText}>{flashLabel(flash)}</Text>
          </Pressable>

          <Pressable onPress={toggleFacing} style={styles.pillBtn}>
            <Text style={styles.pillText}>Flip</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom controls overlay */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.thumb}
          onPress={() => {
            if (!lastPhoto?.uri) return;
            Alert.alert("Last photo", lastPhoto.uri);
            // TODO: push to review screen with uri param if you want.
            // router.push({ pathname: "/project/[id]/capture/review", params: { id, uri: lastPhoto.uri }});
          }}
        >
          {lastPhoto?.uri ? (
            <Image source={{ uri: lastPhoto.uri }} style={styles.thumbImg} />
          ) : (
            <View style={styles.thumbPlaceholder} />
          )}
        </Pressable>

        <Pressable
          onPress={takePhoto}
          disabled={isCapturing}
          style={({ pressed }) => [
            styles.shutterOuter,
            (pressed || isCapturing) && styles.shutterOuterPressed,
          ]}
        >
          <View style={styles.shutterInner} />
        </Pressable>

        <Pressable
          style={styles.noteBtn}
          onPress={() => {
            // Optional: route to add note for this capture
            // router.push({ pathname: "/project/[id]/capture/addnotes", params: { id }});
            Alert.alert("Add note", "Hook this to your add-note flow.");
          }}
        >
          <Text style={styles.noteBtnText}>+ Note</Text>
        </Pressable>
      </View>

      {/* Saved toast */}
      {showSavedToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Saved ✓</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  permissionBody: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 16,
  },

  primaryBtn: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  primaryBtnText: { color: "black", fontWeight: "700" },

  secondaryBtn: { paddingHorizontal: 16, paddingVertical: 12, marginTop: 8 },
  secondaryBtnText: { color: "white", opacity: 0.9 },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 52, // if you use SafeAreaView you can remove this and rely on insets
    paddingHorizontal: 12,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnText: { color: "white", fontSize: 20, fontWeight: "700" },

  titleBlock: { flex: 1, marginLeft: 10 },
  title: { color: "white", fontSize: 18, fontWeight: "800" },
  subtitle: { color: "white", opacity: 0.8, marginTop: 2, fontSize: 12 },

  topRight: { flexDirection: "row", gap: 8 },
  pillBtn: {
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pillText: { color: "white", fontSize: 12, fontWeight: "700" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingBottom: 28,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  thumbImg: { width: "100%", height: "100%" },
  thumbPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
  },

  shutterOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 5,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  shutterOuterPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },

  noteBtn: {
    minWidth: 80,
    height: 44,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  noteBtnText: { color: "white", fontWeight: "800" },

  toast: {
    position: "absolute",
    alignSelf: "center",
    bottom: 120,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toastText: { color: "white", fontWeight: "800" },
});
