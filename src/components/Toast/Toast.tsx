import { useRef } from "react";
import { Close } from "@mui/icons-material";
import { ToastInternalType } from "@/contexts/ToastContext";
import { Paragraph } from "../Paragraph";

interface ToastProps {
  toast: ToastInternalType;
  onClose: () => void;
}

export function Toast({ toast: { text }, onClose }: ToastProps) {
  const toastRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="w-fit flex flex-row justify-between items-between py-4 pl-6 pr-4 bg-zinc-700 rounded-md"
      ref={toastRef}
    >
      <Paragraph size="m" color="secondary-1">
        {text}
      </Paragraph>
      <Close
        className="ml-4 text-secondary-200 hover:text-secondary-400 cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
}
