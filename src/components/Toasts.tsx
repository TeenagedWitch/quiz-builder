import { useEffect, useState } from "react";
import type { ToastEventDetail } from "@/utility/toast";
import { variantToClass } from "@/constants/toastVariants";

type ToastItem = Required<ToastEventDetail>;

export default function Toasts() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast = (ev: Event) => {
      const detail = (ev as CustomEvent<ToastEventDetail>).detail;
      if (!detail) return;
      const item: ToastItem = {
        id: detail.id,
        message: detail.message,
        variant: detail.variant,
        timeoutMs: detail.timeoutMs ?? 4000,
      };
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== item.id));
      }, item.timeoutMs);
    };

    window.addEventListener("app:toast", onToast as EventListener);
    return () =>
      window.removeEventListener("app:toast", onToast as EventListener);
  }, []);

  if (items.length === 0) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 1080, pointerEvents: "none" }}
    >
      <div className="d-flex flex-column gap-2 align-items-end">
        {items.map((t) => (
          <div
            key={t.id}
            className={`alert ${variantToClass[t.variant]} shadow`}
            role="alert"
            style={{ minWidth: 280, maxWidth: 420, pointerEvents: "auto" }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
