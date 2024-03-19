import { ContestListPage } from "@/features";
import { ProblemQuery } from "@/types";

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
