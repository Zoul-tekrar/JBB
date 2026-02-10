import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function FakeMapBox() {
  return (
    <View style={styles.container}>
      <View style={styles.mapBackground} />

      <View style={styles.pin}>
        <FontAwesome name="map-marker" size={28} color="#F47B20" />
      </View>

      <Text style={styles.label}>Project location</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#e5e5e5",
    position: "relative",
    marginVertical: 12,
  },

  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#d9e6df",
  },

  pin: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -14 }, { translateY: -28 }],
  },

  label: {
    position: "absolute",
    bottom: 8,
    left: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
