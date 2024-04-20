import { ContestDetailPage } from "@/features";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { ContestQuery } from "@/types";
import { useMemo } from "react";

export default async function Page({
  params: { id },
  searchParams: { tab },
}: {
  params: { id: string };
  searchParams: ContestQuery;
}) {
  const query = {
    tab,
  };
  const user = await getAuthUserNext();
  return <ContestDetailPage contestQuery={query} contestId={id} user={user} />;
}
