import { ProblemListPage } from "@/features";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface HomeProps {
  search?: string;
}

export default function Home({ search }: HomeProps) {
  const { data: session } = useSession({ required: false });

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (!session) return <p>No Permission</p>;

  return <ProblemListPage userSearch={search} />;
}

Home.getInitialProps = async ({ query }: { query: HomeProps }) => {
  const { search } = query;

  return { search };
};
