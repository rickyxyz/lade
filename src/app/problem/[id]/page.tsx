import { ProblemDetailPage } from "@/features";
import { getAuthUserNext } from "@/libs/next-auth/helper";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getAuthUserNext();
  return <ProblemDetailPage id={id} user={user} />;
}
