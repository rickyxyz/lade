import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { Navbar } from "@/components";
import "@/styles/globals.css";
import { Sidebar } from "@/components/Layout/Sidebar/Sidebar";
import { useEffect } from "react";
import { mathjax3, md } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    md.use(mathjax3);
  }, []);

  return (
    <>
      <style jsx global>{`
        #__next > *:not(.icon) {
          font-family: ${inter.style.fontFamily}!important;
        }
      `}</style>
      <div className="h-full flex flex-col flex-auto overflow-hidden">
        <Navbar />
        <div className="w-full h-full overflow-y-scroll">
          <div className="h-full flex-reverse relative w-adaptive mx-auto">
            <Sidebar />
            <div
              className="w-full relative p-8 pt-8"
              style={{
                position: "absolute",
                width: "calc(100% - 16rem)",
                right: 0,
              }}
            >
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
