import { useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button, Icon, Input, User, Dropdown, IconText } from "@/components";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { User as UserType, getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { crudData, logout } from "@/libs/firebase";
import { BsCaretDownFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { signIn } from "next-auth/react";
import { api } from "@/utils/api";
import { useDebounce } from "@/hooks";
import { API } from "@/api";

export function PageTemplateNav() {
  const auth = getAuth();
  const user = useAppSelector("user");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const debounce = useDebounce();

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
            label="Login"
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

  const handleUpdateUser = useCallback(
    (authUser: UserType) => {
      debounce(() => {
        if (!user) {
          console.log("Debounced");
          API("get_user", {
            params: {
              uid: authUser.uid,
            },
          }).then((result) => {
            console.log("Fetched User: ");
            console.log(result.data);
            if (result.data) {
              dispatch("update_user", result.data);
              router.push("/");
              authUser.getIdToken(true).then((idToken) =>
                signIn("credentials", {
                  idToken,
                  redirect: false,
                })
              );
            }
          });
        }
      }, 1000);
    },
    [debounce, dispatch, router, user]
  );

  const handleInitialize = useCallback(() => {
    return onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        dispatch("reset_user", undefined);
        // User is signed out
        // ...
      } else {
        handleUpdateUser(authUser);
      }
    });
  }, [auth, dispatch, handleUpdateUser]);

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
