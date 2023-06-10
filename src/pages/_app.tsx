import type { AppProps } from "next/app";
import { useEffect, useMemo, useState } from "react";
import { Navbar, Sidebar } from "@/components";
import { mathjax3, md } from "@/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { ProblemEditInitializedContext } from "@/hooks";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    md.use(mathjax3);
  }, []);

  const renderMainPage = useMemo(
    () => (
      <div className="w-full h-full overflow-y-scroll">
        <div className="h-full flex-reverse relative w-adaptive mx-auto">
          <Sidebar />
          <div
            className="w-full absolute right-0 p-8 pt-8"
            style={{
              width: "calc(100% - 14rem)",
            }}
          >
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    ),
    [Component, pageProps]
  );

  return (
    <>
      <style jsx global>{`
        #__next > *:not(.icon) {
          font-family: ${inter.style.fontFamily}!important;
        }
      `}</style>
      <ProblemEditInitializedContext.Provider
        value={[initialized, setInitialized]}
      >
        <div className="h-full flex flex-col flex-auto overflow-hidden">
          <Navbar />
          {renderMainPage}
        </div>
      </ProblemEditInitializedContext.Provider>
    </>
  );
}
