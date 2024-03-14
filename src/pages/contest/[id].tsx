import { ContestDetailPage } from "@/features/ContestDetail";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { NextApiRequest, NextApiResponse } from "next";
import { useMemo } from "react";

interface ProblemProps {
  id: string;
  user: string;
}

export function Contest({ id, user }: ProblemProps) {
  const parsedUser = useMemo(() => JSON.parse(user), [user]);
  return <ContestDetailPage id={id} user={parsedUser} />;
}

export async function getServerSideProps({ params }: { params: ProblemProps }) {
  const user = await getAuthUserNext();

  const { id } = params;

  return { props: { id, user: JSON.stringify(user) } };
}

export default Contest;
