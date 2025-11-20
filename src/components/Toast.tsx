import React, { useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  durationMs?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  durationMs = 2500,
  onClose,
}) => {
  useEffect(() => {
    const id = setTimeout(onClose, durationMs);
    return () => clearTimeout(id);
  }, [durationMs, onClose]);

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast__icon">✓</span>
      <span className="toast__text">{message}</span>
    </div>
  );
};
