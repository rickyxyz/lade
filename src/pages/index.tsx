import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Card, PageGenericTemplate } from "@/components";
import { useMemo } from "react";

export default function Home() {
  const renderHeader = useMemo(
    () => (
      <Card>
        <h1>Problems</h1>
      </Card>
    ),
    []
  );

  return <PageGenericTemplate header={renderHeader}></PageGenericTemplate>;
}
