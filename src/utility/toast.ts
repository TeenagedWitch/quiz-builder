export type ToastVariant = "success" | "info" | "warning" | "danger";

export type ToastEventDetail = {
  id: string;
  message: string;
  variant: ToastVariant;
  timeoutMs?: number;
};

export function toast(
  message: string,
  variant: ToastVariant = "info",
  timeoutMs = 4000
) {
  if (typeof window === "undefined") return;
  const detail: ToastEventDetail = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message,
    variant,
    timeoutMs,
  };
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>("app:toast", { detail } as any)
  );
}
