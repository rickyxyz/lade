import { ReactNode, useCallback } from "react";
import { EmptySearch } from "@/assets";
import { Paragraph } from "../Paragraph";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

interface IllustrationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  caption?: string;
  showGoBackButton?: boolean;
}

export function Illustration({
  source: Source,
  caption,
  showGoBackButton,
}: IllustrationProps) {
  const router = useRouter();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <div className="flex flex-col gap-4 items-center m-auto">
      <Source className="fill-secondary-600" />
      <Paragraph color="secondary-6" className="text-center" size="l">
        {caption}
      </Paragraph>
      {showGoBackButton && (
        <Button className="mt-8" onClick={handleGoBack}>
          Go Back
        </Button>
      )}
    </div>
  );
}
