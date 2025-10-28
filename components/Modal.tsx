"use client";

import { ReactNode, useEffect } from "react";

type ModalProps = {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  centered?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  dialogClassName?: string;
};

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  centered = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  dialogClassName,
}: ModalProps) {
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const dialogClasses = [
    "modal-dialog",
    centered ? "modal-dialog-centered" : "",
    dialogClassName ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => {
          if (closeOnBackdrop && event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <div className={dialogClasses}>
          <div className="modal-content">
            {(title ?? true) && (
              <div className="modal-header">
                {title ? <h5 className="modal-title">{title}</h5> : <span />}
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onClose}
                />
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
}
