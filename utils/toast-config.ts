import { toast, type ToastOptions } from "react-toastify";

const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  draggable: true,
  style: {
    fontFamily: "Kanit, sans-serif",
    borderRadius: "8px",
    fontWeight: "500",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

export const toastSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, { ...defaultToastOptions, ...options });
};

export const toastError = (message: string, options?: ToastOptions) => {
  return toast.error(message, { ...defaultToastOptions, ...options });
};

export const toastInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, { ...defaultToastOptions, ...options });
};

export const toastWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, { ...defaultToastOptions, ...options });
};