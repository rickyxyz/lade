import { ProblemListPage } from "@/features";
import {
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
} from "@/types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface HomeProps {
  search?: string;
  topic?: ProblemTopicNameType;
  subTopic?: ProblemSubtopicNameType;
  sort?: ProblemSortByType;
}

export default function Home(query: HomeProps) {
  const { data: session } = useSession({ required: false });

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (!session) return <p>No Permission</p>;

  return <ProblemListPage query={query} />;
}

Home.getInitialProps = async ({ query }: { query: HomeProps }) => {
  const { search, topic, subTopic, sort } = query;

  return { search, topic, subTopic, sort };
};
