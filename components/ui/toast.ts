import Toast, { ToastType } from "react-native-toast-message";
export const showSuccess = (message: string) => {
  showToast(message, "success");
};
export const showError = (message: string) => {
  showToast(message, "error");
};

export const showInfo = (message: string) => {
  showToast(message, "info");
};

const showToast = (message: string, type: ToastType) => {
  Toast.show({
    type: type,
    text1: message,
    text2: message,
    position: "bottom",
  });
};
