import { ProblemDetailPage } from "@/features/ProblemDetail/pages/ProblemDetailPage";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { ContentAccessType, UserType } from "@/types";
import { getServerSession } from "next-auth";

interface ProblemProps {
  id: string;
  user: string;
}

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = await getAuthUserNext();
  return <ProblemDetailPage id={id} user={user} />;
}

// export async function getServerSideProps({
//   params,
//   req,
//   res,
// }: {
//   params: ProblemProps;
//   req: NextApiRequest;
//   res: NextApiResponse;
// }) {
//   const user = await getAuthUser(req, res);

//   const { id } = params;

//   return { props: { id, user: JSON.stringify(user) } };
// }

// export default Problem;
