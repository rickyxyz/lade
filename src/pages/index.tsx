import { ProblemListPage } from "@/features";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession({ required: false });

  useEffect(() => {
    console.log(session);
  }, [session]);

  if (!session) return <p>No Permission</p>;

  return <ProblemListPage />;
}
