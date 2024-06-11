"use client";
import { useCallback, useEffect, useState } from "react";
import "@/styles/globals.css";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { mathjax3, md } from "@/utils";
import { DeviceScreenType, LayoutContextType } from "@/types";
import {
  LAYOUT_DEFAULT,
  LAYOUT_THRESHOLD_DESKTOP,
  LAYOUT_THRESHOLD_TABLET,
} from "@/consts";
import { noto } from "@/libs/fonts";
import ProviderWrapper from "@/contexts/ProviderWrapper";
import { ToastInternalType } from "@/contexts/ToastContext";
import { Toast } from "@/components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<LayoutContextType>(LAYOUT_DEFAULT);
  const stateInitialized = useState(false);
  const stateToasts = useState<ToastInternalType[]>([]);
  const [toasts, setToasts] = stateToasts;

  const handleUpdateLayout = useCallback(() => {
    const { innerWidth: width, innerHeight: height } = window;

    const device: DeviceScreenType = (() => {
      if (width < LAYOUT_THRESHOLD_TABLET) return "mobile";
      if (width < LAYOUT_THRESHOLD_DESKTOP) return "tablet";
      return "desktop";
    })();

    setLayout({
      device,
      width,
      height,
    });
  }, []);

  const handleInitialize = useCallback(() => {
    window.addEventListener("resize", handleUpdateLayout);
  }, [handleUpdateLayout]);

  useEffect(() => {
    handleInitialize();
  }, [handleInitialize]);

  useEffect(() => {
    md.use(mathjax3);
  }, []);

  return (
    <html>
      <style jsx global>{`
        * {
          font-family: ${noto.style.fontFamily}!important;
        }
        .MathJax[display="true"] {
          overflow-x: auto;
        }
        .MathJax svg {
          height: min-content !important;
        }
      `}</style>
      <body className={noto.className}>
        <ProviderWrapper
          layout={layout}
          stateInitialized={stateInitialized}
          stateToasts={stateToasts}
        >
          {children}
        </ProviderWrapper>
        <div className="fixed right-8 bottom-8 gap-2 flex flex-col-reverse items-end">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onClose={() => {
                setToasts((prev) => prev.filter(({ id }) => id !== toast.id));
              }}
            />
          ))}
        </div>
      </body>
    </html>
  );
}
