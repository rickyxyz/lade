import { ProblemDetailPage } from "@/features/ProblemDetail";

interface ProblemProps {
  id: string;
}

export function Problem({ id }: ProblemProps) {
  return <ProblemDetailPage id={id} />;
}

export async function getServerSideProps({ params }: { params: ProblemProps }) {
  const { id } = params;

  return { props: { id } };
}

export default Problem;
