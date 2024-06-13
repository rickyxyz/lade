import { useRef } from "react";
import { Close } from "@mui/icons-material";
import { ToastInternalType } from "@/contexts/ToastContext";
import { Paragraph } from "../Paragraph";
import clsx from "clsx";

interface ToastProps {
  toast: ToastInternalType;
  onClose: () => void;
  maxWidth?: number;
}

export function Toast({ toast: { text }, onClose, maxWidth }: ToastProps) {
  return (
    <div
      className={clsx(
        "flex flex-row justify-between items-between",
        "w-max py-4 pl-6 pr-4 bg-zinc-700 rounded-md"
      )}
      style={{
        maxWidth,
      }}
    >
      <Paragraph size="m" color="secondary-1">
        {text}
      </Paragraph>
      <Close
        role="button"
        className="ml-4 text-secondary-200 hover:text-secondary-400 cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
}
