import { ContestDetailPage } from "@/features";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { useMemo } from "react";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getAuthUserNext();
  return <ContestDetailPage id={id} user={user} />;
}
