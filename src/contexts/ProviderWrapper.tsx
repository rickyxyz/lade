"use client";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import "@/styles/globals.css";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { mathjax3, md } from "@/utils";
import { ProblemEditInitializedContext } from "@/hooks";
import { LayoutContext } from "@/contexts";
import { DeviceScreenType, LayoutContextType, StateType } from "@/types";
import {
  LAYOUT_DEFAULT,
  LAYOUT_THRESHOLD_DESKTOP,
  LAYOUT_THRESHOLD_TABLET,
} from "@/consts";
import { Provider } from "react-redux";
import { persistor, store } from "@/libs/redux";
import clsx from "clsx";
import { PageTemplateNav } from "@/templates";
import { PersistGate } from "redux-persist/integration/react";
import { noto } from "@/libs/fonts";

export default function ProviderWrapper({
  children,
  layout,
  stateInitialized,
}: {
  children: ReactNode;
  layout: LayoutContextType;
  stateInitialized: StateType<boolean>;
}) {
  return (
    <>
      <SessionProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ProblemEditInitializedContext.Provider value={stateInitialized}>
              <LayoutContext.Provider value={layout}>
                {children}
              </LayoutContext.Provider>
            </ProblemEditInitializedContext.Provider>
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>
  );
}
