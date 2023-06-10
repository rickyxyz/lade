import { useMemo } from "react";
import { Card, GenericPageTemplate } from "@/components";
export default function SignUp() {
  const renderForm = useMemo(
    () => (
      <Card>
        <span>Test</span>
      </Card>
    ),
    []
  );

  return <GenericPageTemplate>{renderForm}</GenericPageTemplate>;
}
