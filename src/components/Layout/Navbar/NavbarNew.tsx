import { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button, Icon, Input, User, Dropdown, IconText } from "@/components";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { crudData, logout } from "@/libs/firebase";
import { BsCaretDownFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";

export function NavbarNew() {
  const auth = getAuth();
  const user = useAppSelector("user");
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const renderAuthButtons = useMemo(
    () =>
      user ? (
        <Dropdown
          direction="left"
          optionWidth={200}
          classNameOption="flex gap-4"
          options={[
            {
              id: "Logout",
              className: "text-red-500",
              element: <IconText IconComponent={MdLogout} text="Logout" />,
              onClick: logout,
            },
          ]}
          triggerElement={
            <User
              className="relative"
              username={user.id}
              captionElement={
                <Icon
                  className="ml-2"
                  IconComponent={BsCaretDownFill}
                  size="s"
                />
              }
            />
          }
        />
      ) : (
        // <Tooltip
        //   direction="left"
        //   optionWidth={200}
        //   triggerElement={
        //     <User
        //       className="relative"
        //       username={user.username}
        //       captionElement={
        //         <Icon className="ml-2" icon="caretDownFill" size="xs" />
        //       }
        //     />
        //   }
        //   hiddenElement={
        //     <>
        //       <TooltipOption className="justify-between" onClick={logout}>
        //         <span>Logout</span>
        //         <Icon icon="logout" />
        //       </TooltipOption>
        //     </>
        //   }
        // />
        <div className="flex flex-row gap-4 mr-6 w-fit">
          <Button
            onClick={() => {
              router.push("/login");
            }}
            variant="ghost"
            label="Log In"
          />
          <Button
            onClick={() => {
              router.push("/signup");
            }}
            label="Sign Up"
          />
        </div>
      ),
    [router, user]
  );

  const handleInitialize = useCallback(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
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
