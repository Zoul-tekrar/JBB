import { StyleSheet, Text, View } from "react-native";
import { colorCodes } from "../ui/colorCodes";

type Props = {
  title: string;
};

export function JbbTitle(props: Props) {
  return (
    <View>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    color: colorCodes.JBBBLACKJBB,
    borderColor: colorCodes.JBBORANGE,
    borderBottomColor: colorCodes.JBBORANGE,
    borderBottomWidth: 4,
    fontSize: 22,
    paddingBottom: 8,
    fontWeight: "bold",
    marginTop: 10,
  },
});
