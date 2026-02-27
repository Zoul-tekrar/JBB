import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

export type Category = { id: number; name: string };

export function SimpleCategoryDropdown({
  categories,
  valueId,
  onChange,
  placeHolder = "Select...",
}: {
  categories: Category[];
  valueId: number | null;
  onChange: (id: number | null) => void;
  placeHolder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    categories.find((c) => c.id === valueId)?.name ?? placeHolder;

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      >
        <Text>{selected}</Text>
      </Pressable>
      <Modal
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={{ padding: 16, gap: 12 }}>
          <Pressable onPress={() => setOpen(false)}>
            <Text style={{ fontSize: 16 }}>Close</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              onChange(null);
              setOpen(false);
            }}
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderColor: "#eee",
            }}
          >
            <Text style={{ fontSize: 16, opacity: 0.7 }}>Clear</Text>
          </Pressable>

          {categories.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                onChange(c.id);
                setOpen(false);
              }}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
            >
              <Text style={{ fontSize: 16 }}>{c.name}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}
