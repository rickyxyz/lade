"use client";
import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User as UserType, getAuth, onAuthStateChanged } from "firebase/auth";
import { API } from "@/api";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { useDebounce, useDevice } from "@/hooks";
import { RoleType } from "@/types";
import { PageTemplateNavDesktop } from "./PageTemplateNavDesktop";
import { PageTemplateNavMobile } from "./PageTemplateNavMobile";

export function PageTemplateNav() {
  const auth = getAuth();
  const user = useAppSelector("user");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const debounce = useDebounce();
  const { device } = useDevice();
  const pathname = usePathname();
  const permission = useMemo<RoleType>(() => {
    if (!user) return "guest";
    return "user";
  }, [user]);

  const renderNav = useMemo(
    () =>
      device === "desktop" ? (
        <PageTemplateNavDesktop
          userId={user?.id}
          device={device}
          pathname={pathname}
          permission={permission}
        />
      ) : (
        <PageTemplateNavMobile
          userId={user?.id}
          device={device}
          pathname={pathname}
          permission={permission}
        />
      ),
    [device, pathname, permission, user?.id]
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

  return renderNav;
}
