import { ContestDetailPage } from "@/features/ContestDetail";
import { ProblemDetailPage } from "@/features/ProblemDetail";
import { authConfig } from "@/libs/next-auth";
import { getAuthUser } from "@/libs/next-auth/helper";
import { ContentAccessType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { useMemo } from "react";

interface ProblemProps {
  id: string;
  user: string;
}

export function Contest({ id, user }: ProblemProps) {
  const parsedUser = useMemo(() => JSON.parse(user), [user]);
  return <ContestDetailPage id={id} user={parsedUser} />;
}

export async function getServerSideProps({
  params,
  req,
  res,
}: {
  params: ProblemProps;
  req: NextApiRequest;
  res: NextApiResponse;
}) {
  const user = await getAuthUser(req, res);

  const { id } = params;

  return { props: { id, user: JSON.stringify(user) } };
}

export default Contest;
