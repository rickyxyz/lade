import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button, Icon, Input, Select, User } from "@/components";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/redux/dispatch";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { crudData, logout } from "@/firebase";
import { Tooltip } from "@/components/Generic/Tooltip";
import { SelectOption } from "@/components/Generic/Select/SelectOption";
import { TooltipOption } from "@/components/Generic/Tooltip/TooltipOption";

export function Navbar() {
  const auth = getAuth();
  const user = useAppSelector("user");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const renderSearchField = useMemo(
    () => (
      <Input
        variant="solid"
        style={{ minWidth: "min(480px, 100%)" }}
        placeholder="Search a question"
      />
    ),
    []
  );

  const renderUserDropdown = useMemo(() => <div className=""></div>, []);

  const renderAuthButtons = useMemo(
    () =>
      user ? (
        <Tooltip
          direction="left"
          optionWidth={200}
          triggerElement={
            <User
              className="relative"
              name={user.username}
              captionElement={
                <Icon className="ml-2" icon="caretDownFill" size="xs" />
              }
            />
          }
          hiddenElement={
            <>
              <TooltipOption className="justify-between" onClick={logout}>
                <span>Logout</span>
                <Icon icon="logout" />
              </TooltipOption>
            </>
          }
        />
      ) : (
        <div className="flex flex-row gap-4 mr-6 w-fit">
          <Button
            onClick={() => {
              router.push("/login");
            }}
            variant="ghost"
          >
            Log In
          </Button>
          <Button
            onClick={() => {
              router.push("/signup");
            }}
          >
            Sign Up
          </Button>
          <Button
            onClick={() => {
              dispatch("update_user", {
                username: "Test",
                joinDate: 0,
              });
            }}
            variant="ghost"
          >
            Test
          </Button>
        </div>
      ),
    [dispatch, router, user]
  );

  const handleInitialize = useCallback(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const id = user.uid;

        const userData = await crudData("get_user", {
          id,
        });

        dispatch("update_user", userData);
      } else {
        dispatch("reset_user", undefined);
        // User is signed out
        // ...
      }
    });
  }, [auth, dispatch]);

  useEffect(() => {
    const listener = handleInitialize();
    return () => {
      listener();
    };
  }, [handleInitialize]);

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
  "sticky top-0 flex justify-between items-center h-16",
  "bg-gray-50",
  "border-t-4 border-t-teal-500 border-b border-gray-200 z-20"
);

const NAVBAR_INNER_STYLE = clsx(
  "flex justify-between items-center mx-auto w-adaptive gap-4"
);
