"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "@/styles/globals.css";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { LayoutContext } from "@/contexts";
import { persistor, store } from "@/libs/redux";
import { EditorInitializedContext } from "@/hooks";
import { LayoutContextType, StateType } from "@/types";
import { QueryParamProvider } from "use-query-params";
import NextAdapterApp from "next-query-params/app";

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
      <QueryParamProvider adapter={NextAdapterApp}>
        <SessionProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <EditorInitializedContext.Provider value={stateInitialized}>
                <LayoutContext.Provider value={layout}>
                  {children}
                </LayoutContext.Provider>
              </EditorInitializedContext.Provider>
            </PersistGate>
          </Provider>
        </SessionProvider>
      </QueryParamProvider>
    </>
  );
}
