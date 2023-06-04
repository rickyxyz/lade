import clsx from "clsx";
import { useMemo } from "react";

interface UserProps {
  name: string;
  caption?: string;
}

export function User({ name, caption }: UserProps) {
  const userInitials = useMemo(() => {
    const words = name.split(" ").slice(0, 2);
    return words.map((word) => word[0]).join("");
  }, [name]);

  return (
    <div className="flex items-center text-xs mb-4">
      <div
        className={clsx(
          "flex items-center justify-center",
          "w-8 h-8",
          "font-bold bg-red-700 rounded-full"
        )}
      >
        <span className="text-white">{userInitials}</span>
      </div>
      <span className="ml-2 font-bold">{name}</span>
      {caption && (
        <>
          <span className="mx-1.5" style={{ fontSize: "8px" }}>
            ●
          </span>
          <span>{caption}</span>
        </>
      )}
    </div>
  );
}
