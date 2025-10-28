import { ToastVariant } from "@/utility/toast";

export const variantToClass: Record<ToastVariant, string> = {
  success: "alert-success",
  info: "alert-info",
  warning: "alert-warning",
  danger: "alert-danger",
};
