import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { ProblemListPage } from "@/features";
import { ProblemQuery } from "@/types";

export default function Home(query: ProblemQuery) {
  const { data: session } = useSession({ required: false });

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (!session) return <p>No Permission</p>;

  return <ProblemListPage query={query} />;
}

Home.getInitialProps = async ({ query }: { query: ProblemQuery }) => {
  const { search, topic, subTopic, sort, page } = query;

  return { search, topic, subTopic, sort, page };
};
