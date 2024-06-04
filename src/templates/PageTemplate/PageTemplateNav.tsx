"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Button,
  Icon,
  Input,
  User,
  Dropdown,
  IconText,
  Paragraph,
  Modal,
  ButtonIcon,
} from "@/components";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/libs/redux";
import { User as UserType, getAuth, onAuthStateChanged } from "firebase/auth";
import { crudData, logout } from "@/libs/firebase";
import { signIn } from "next-auth/react";
import { api } from "@/utils/api";
import { useDebounce, useDevice } from "@/hooks";
import { API } from "@/api";
import { usePathname, useRouter } from "next/navigation";
import {
  AddToPhotosOutlined,
  ArrowDropDown,
  AssignmentOutlined,
  DescriptionOutlined,
  EmojiEventsOutlined,
  LibraryBooksOutlined,
  LightbulbOutlined,
  LoginOutlined,
  Logout,
  LogoutOutlined,
  Menu,
  NoteAddOutlined,
  Person,
  PersonAddAltOutlined,
  SvgIconComponent,
} from "@mui/icons-material";
import { checkPermissionLink } from "@/utils";
import { LinkPermissionType, RoleType } from "@/types";
import { PageTemplateNavDesktopButton } from "./PageTemplateNavDesktopButton";
import { PageTemplateNavMobileButton } from "./PageTemplateNavMobileButton";
import { PageTemplateNavDesktop } from "./PageTemplateNavDesktop";
import { PageTemplateNavMobile } from "./PageTemplateNavMobile";

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
  icon: SvgIconComponent;
  permission?: LinkPermissionType;
}

interface NavGroup {
  name: string;
  links: NavLink[];
  permission?: LinkPermissionType;
}

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
    () => (
      device === "desktop" ?
        <PageTemplateNavDesktop device={device} pathname={pathname} permission={permission} /> :
        <PageTemplateNavMobile device={device} pathname={pathname} permission={permission} />
    ),
    [device, pathname, permission]
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
