import { useMemo } from "react";
import Image from "next/image";
import { Button, Input } from "@/components";
import clsx from "clsx";

export function Navbar() {
  const renderSearchField = useMemo(
    () => (
      <Input
        variant="solid"
        style={{ width: "480px" }}
        placeholder="Search a question"
      />
    ),
    []
  );

  const renderAuthButtons = useMemo(
    () => (
      <div className="flex flex-row gap-4 mr-6 w-fit">
        <Button variant="ghost">Log In</Button>
        <Button>Sign Up</Button>
      </div>
    ),
    []
  );

  return (
    <nav className={NAVBAR_OUTER_STYLE} style={{ minHeight: "4rem" }}>
      <div className={NAVBAR_INNER_STYLE}>
        <Image src="/lade.svg" alt="LADE Logo" width={120} height={56} />
        {renderSearchField}
        {renderAuthButtons}
      </div>
    </nav>
  );
}

const NAVBAR_OUTER_STYLE = clsx(
  "flex justify-between items-center h-16",
  "bg-gray-50",
  "border-t-4 border-t-teal-500 border-b border-gray-200"
);

const NAVBAR_INNER_STYLE = clsx(
  "flex justify-between items-center mx-auto w-adaptive gap-4"
);
