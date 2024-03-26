import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Either, UserType } from "@/types";
import { useDevice } from "@/hooks";

type UserProps = UserBaseProps &
  Either<
    {
      username: string;
    },
    {
      id: string;
    }
  >;

type UserBaseProps = {
  caption?: string;
  captionElement?: ReactNode;
  className?: string;
  username?: string;
  hideName?: boolean;
};

export function User({
  className,
  caption,
  captionElement,
  username,
  hideName,
}: UserProps) {
  const userInitials = useMemo(() => {
    if (!username) return "?";

    const words = username.split(" ").slice(0, 2);
    return words.map((word) => word[0]).join("");
  }, [username]);

  return (
    <div className={clsx("flex items-center text-xs", className)}>
      <div
        className={clsx(
          "flex items-center justify-center",
          "w-10 h-10",
          "rounded-full",
          username ? "bg-gray-500" : "bg-red-700"
        )}
      >
        <span className="text-white">{userInitials}</span>
      </div>
      {!hideName && <span className="ml-3 ">{username}</span>}
      {caption && (
        <>
          <span className="mx-1.5" style={{ fontSize: "8px" }}>
            ●
          </span>
          <span>{caption}</span>
        </>
      )}
      {captionElement}
    </div>
  );
}
