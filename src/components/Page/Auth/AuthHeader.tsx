import { ReactNode } from "react";

export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <>
      <h1 className="text-2xl text-center">{title}</h1>
      <p className="text-center mb-8">{subtitle}</p>
    </>
  );
}
