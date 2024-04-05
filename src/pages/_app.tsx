import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import "@/styles/globals.css";
import "@/styles/markdown-editor.css";
import "@/styles/markdown.css";
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
import { PageTemplateNav } from "@/templates";
import { PersistGate } from "redux-persist/integration/react";
import { noto } from "@/libs/fonts";

export default function App({ Component, pageProps }: AppProps) {
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
    <>
      <style jsx global>{`
        * {
          font-family: ${noto.style.fontFamily}!important;
        }
        .MathJax[display="true"] {
          overflow-x: auto;
        }
      `}</style>

      <SessionProvider session={pageProps.session}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ProblemEditInitializedContext.Provider value={stateInitialized}>
              <LayoutContext.Provider value={layout}>
                <div
                  className={clsx(
                    "relative h-full flex flex-col flex-auto overflow-x-hidden",
                    noto.className
                  )}
                >
                  <Component {...pageProps} />
                </div>
              </LayoutContext.Provider>
            </ProblemEditInitializedContext.Provider>
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>
  );
}
