import { ProblemListPage } from "@/features";
import { ProblemListPageNew } from "@/features/ProblemList/pages/ProblemListPageNew";
import { usePathname, useSearchParams } from "next/navigation";

export default async function Page() {
  // Fetch data directly in a Server Component
  // Forward fetched data to your Client Component
  return <ProblemListPageNew />;
}
