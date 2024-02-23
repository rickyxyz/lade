import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProblemQuery } from "@/types";
import { ContestListPage } from "@/features/ContestList";

export default function Home(query: ProblemQuery) {
  const { data: session } = useSession({ required: false });

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (!session) return <p>No Permission</p>;

  return <ContestListPage query={query} />;
}

Home.getInitialProps = async ({ query }: { query: ProblemQuery }) => {
  const { search, topic, subTopic, sort, page } = query;

  return { search, topic, subTopic, sort, page };
};
