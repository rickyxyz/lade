import { ProblemListPage } from "@/features";
import { ContestListPage } from "@/features/ContestList/pages/ContestListPage";
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
  return <ContestListPage query={query} />;
}
