import { ContestProblemsPage } from "@/features/ContestProblems";
import { getAuthUserNext } from "@/libs/next-auth/helper";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getAuthUserNext();
  return <ContestProblemsPage contestId={id} user={user} />;
}
