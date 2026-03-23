import {
  Category,
  SimpleCategoryDropdown,
} from "@/components/app-components/simpleCategoryDropdown";
import { CaptureEntry } from "@/features/capture/upload";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Text, TextInput, View } from "react-native";
type NotesFormProps = {
  categories: Category[];
  control: Control<CaptureEntry>;
  errors: FieldErrors<CaptureEntry>;
};

export default function AddNotes({
  categories,
  control,
  errors,
}: NotesFormProps) {
  return (
    <View>
      {errors.categoryId?.message && (
        <Text className="text-center text-bold text-l text-red-700 font-semibold">
          {errors.categoryId.message}
        </Text>
      )}
      <Controller
        control={control}
        name="categoryId"
        render={({ field: { onChange, value } }) => (
          <View style={{ gap: 6 }}>
            <Text style={{ opacity: 0.8 }}>Category</Text>
            <SimpleCategoryDropdown
              categories={categories}
              valueId={value}
              onChange={onChange}
            ></SimpleCategoryDropdown>
          </View>
        )}
      ></Controller>
      <View>
        <Text>Notes</Text>
        {errors.shortDescription?.message && (
          <Text className="text-center text-bold text-l text-red-700 font-semibold">
            {errors.shortDescription.message}
          </Text>
        )}
        <Controller
          control={control}
          name="shortDescription"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="mt-2 rounded-xl border px-3 py-3"
              value={value}
              onChangeText={onChange}
            ></TextInput>
          )}
        ></Controller>
      </View>
    </View>
  );
}
