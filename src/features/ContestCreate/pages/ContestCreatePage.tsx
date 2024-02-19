import { useMemo, useState } from "react";
import { ContestDatabaseType, ContestType } from "@/types";
import { CONTEST_DEFAULT } from "@/consts";
import { ContestEdit } from "../components";
import { PageTemplate } from "@/templates";

export function ContestCreatePage() {
  const stateContest = useState<ContestType>(CONTEST_DEFAULT);
  const contest = stateContest[0];

  const renderHead = useMemo(() => {
    return <h1 className="mb-8">Create Contest</h1>;
  }, []);

  return (
    <PageTemplate>
      <ContestEdit
        headElement={renderHead}
        contest={contest}
        purpose="create"
      />
    </PageTemplate>
  );
}
