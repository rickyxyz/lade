"use client";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import "@/styles/globals.css";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { mathjax3, md } from "@/utils";
import { ProblemEditInitializedContext } from "@/hooks";
import { LayoutContext } from "@/contexts";
import { DeviceScreenType, LayoutContextType } from "@/types";
import {
  LAYOUT_DEFAULT,
  LAYOUT_THRESHOLD_DESKTOP,
  LAYOUT_THRESHOLD_TABLET,
} from "@/consts";
import { Provider } from "react-redux";
import { persistor, store } from "@/libs/redux";
import clsx from "clsx";
import { PageTemplateNav, PageTemplateNavNew } from "@/templates";
import { PersistGate } from "redux-persist/integration/react";
import { noto } from "@/libs/fonts";
import ProviderWrapper from "@/contexts/ProviderWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layout, setLayout] = useState<LayoutContextType>(LAYOUT_DEFAULT);
  const stateInitialized = useState(false);

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
      `}</style>
      <body>
        <ProviderWrapper layout={layout} stateInitialized={stateInitialized}>
          <div
            className={clsx(
              "relative h-full flex flex-col flex-auto overflow-x-hidden",
              noto.className
            )}
          >
            <PageTemplateNavNew />
            {children}
          </div>
        </ProviderWrapper>
      </body>
    </html>
  );
}
