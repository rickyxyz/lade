import { ProblemListPage } from "@/features";
import { ProblemListPageNew } from "@/features/ProblemList/pages/ProblemListPageNew";
import { ProblemQuery } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: ProblemQuery;
}) {
  const { page, search, sort, subTopic, topic } = searchParams;
  const query = {
    page,
    search,
    sort,
    subTopic,
    topic,
  };
  return <ProblemListPageNew query={query} />;
}
