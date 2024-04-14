import { ContestDetailPage } from "@/features";
import { ContestProblemsPage } from "@/features/ContestProblems";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { useMemo } from "react";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getAuthUserNext();
  return <ContestProblemsPage id={id} user={user} />;
}
