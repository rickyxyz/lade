import { ContestScoreboardPage } from "@/features/ContestScoreboard";
import { getAuthUserNext } from "@/libs/next-auth/helper";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getAuthUserNext();
  return <ContestScoreboardPage contestId={id} user={user} />;
}
