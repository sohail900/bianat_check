import { ToastOptions, toast } from "react-hot-toast";

type ToastType = "success" | "error";

const defaultOptions: ToastOptions = {
  position: "top-center",
  style: {
    borderRadius: "10px",
    background: "#fff",
    color: "black",
  },
};

export const showToast = (
  message: string,
  type: ToastType,
  opt?: ToastOptions
) => {
  const toastFn = type === "success" ? toast.success : toast.error;
  const icon = type === "success" ? "👍" : "❌";
  toastFn(message, { ...defaultOptions, ...opt, icon });
};
