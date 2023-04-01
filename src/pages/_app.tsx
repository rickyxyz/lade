import { Inter } from "next/font/google";
import type { AppProps } from "next/app";
import { Navbar } from "@/components";
import "@/styles/globals.css";
import { Sidebar } from "@/components/Layout/Sidebar/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        #__next > *:not(.icon) {
          font-family: ${inter.style.fontFamily}!important;
        }
      `}</style>
      <div className="h-full flex flex-col flex-auto">
        <Navbar />
        <div className="h-full flex w-adaptive mx-auto">
          <Sidebar />
          <div className="w-full h-full p-8 pt-16">
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    </>
  );
}
