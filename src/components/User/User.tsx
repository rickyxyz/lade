import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useIdentity } from "@/features/Auth";
import { Either, UserType } from "@/types";
import { UNKNOWN_USER_NAME } from "@/consts";

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
};

export function User({
  className,
  caption,
  captionElement,
  ...rest
}: UserProps) {
  const [user, setUser] = useState<UserType>();
  const { identify } = useIdentity();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const id = useMemo<string | undefined>(() => (rest as any).id, [rest]);

  const name = useMemo<string | undefined>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const propsName = (rest as any).username ?? UNKNOWN_USER_NAME;

    const userName = user?.username;

    return userName ?? propsName;
  }, [rest, user?.username]);

  const userInitials = useMemo(() => {
    if (!name) return "?";

    const words = name.split(" ").slice(0, 2);
    return words.map((word) => word[0]).join("");
  }, [name]);

  const handleGetUserData = useCallback(async () => {
    if (id) {
      const data = await identify(id);
      if (data) setUser(data);
    }
  }, [id, identify]);

  useEffect(() => {
    handleGetUserData();
  }, [handleGetUserData]);

  return (
    <div className={clsx("flex items-center text-xs", className)}>
      <div
        className={clsx(
          "flex items-center justify-center",
          "w-8 h-8",
          "font-bold rounded-full",
          name === UNKNOWN_USER_NAME ? "bg-gray-500" : "bg-red-700"
        )}
      >
        <span className="text-white">{userInitials}</span>
      </div>
      <span className="ml-3 font-bold">{name}</span>
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
