import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import "@/styles/globals.css";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { Noto_Sans } from "next/font/google";
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
import { store } from "@/libs/redux";
import clsx from "clsx";
import { PageTemplateNav } from "@/templates";

const inter = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export default function App({ Component, pageProps }: AppProps) {
  const [layout, setLayout] = useState<LayoutContextType>(LAYOUT_DEFAULT);
  const [initialized, setInitialized] = useState(false);

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
          font-family: ${inter.style.fontFamily}!important;
        }
      `}</style>

      <SessionProvider session={pageProps.session}>
        <Provider store={store}>
          <ProblemEditInitializedContext.Provider
            value={[initialized, setInitialized]}
          >
            <LayoutContext.Provider value={layout}>
              <div
                className={clsx(
                  "relative h-full flex flex-col flex-auto overflow-x-hidden",
                  inter.className
                )}
              >
                <PageTemplateNav />
                <Component {...pageProps} />
              </div>
            </LayoutContext.Provider>
          </ProblemEditInitializedContext.Provider>
        </Provider>
      </SessionProvider>
    </>
  );
}
