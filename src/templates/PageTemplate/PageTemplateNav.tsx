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
import { PageTemplateNavButton } from "./PageTemplateNavButton";
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
  const stateMobileLinks = useState(false);
  const setMobileLinks = stateMobileLinks[1];
  const { device } = useDevice();
  const pathname = usePathname();
  const permission = useMemo<RoleType>(() => {
    if (!user) return "guest";
    return "user";
  }, [user]);

  const navLinks = useMemo<NavGroup[]>(
    () => [
      {
        name: "Explore",
        links: [
          {
            label: "Problems",
            href: "/",
            icon: DescriptionOutlined,
          },
          {
            label: "Contests",
            href: "/contests",
            icon: LibraryBooksOutlined,
          },
          {
            label: "Leaderboard",
            href: "/leaderboard",
            icon: EmojiEventsOutlined,
          },
          {
            label: "New Problem",
            href: "/problem/new",
            icon: NoteAddOutlined,
            permission: "user",
          },
          {
            label: "New Contest",
            href: "/contest/new",
            icon: AddToPhotosOutlined,
            permission: "user",
          },
        ],
      },
      {
        name: "Account",
        links: [
          {
            label: "You",
            href: "/user",
            icon: Person,
            permission: "user+",
          },
          {
            label: "Log Out",
            onClick: logout,
            icon: Logout,
            danger: true,
            permission: "user+",
          },
          {
            label: "Sign Up",
            href: "/signup",
            icon: PersonAddAltOutlined,
            permission: "guest",
          },
          {
            label: "Log In",
            href: "/login",
            icon: LoginOutlined,
            permission: "guest",
          },
        ],
      },
    ],
    []
  );

  const renderLinks = useMemo(
    () => (
      <ul className="flex-grow">
        {navLinks
          .filter(({ permission: linkPerm }) =>
            checkPermissionLink(permission, linkPerm)
          )
          .map(({ name, links }, index) => (
            <li className={clsx("flex flex-col gap-1")} key={name}>
              {index > 0 && device !== "desktop" && (
                <hr className="mt-2 mb-1" />
              )}
              {device === "desktop" && (
                <Paragraph
                  className={clsx(index > 0 && "mt-8")}
                  weight="semibold"
                  color="secondary-4"
                >
                  {name}
                </Paragraph>
              )}
              {links
                .filter(({ permission: linkPerm }) =>
                  checkPermissionLink(permission, linkPerm)
                )
                .map(({ label, href, icon, danger }) => (
                  <PageTemplateNavButton
                    key={label}
                    label={label}
                    href={href}
                    icon={icon}
                    device={device}
                    isDanger={danger}
                    isActive={href === pathname}
                  />
                ))}
            </li>
          ))}
      </ul>
    ),
    [device, navLinks, pathname, permission]
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
    <nav
      className={clsx(
        "flex flex-col",
        "border-secondary-300 border-r",
        "py-4",
        "max-lg:max-w-[58px] lg:min-w-[240px]",
        "max-lg:px-2 lg:px-6"
      )}
    >
      <Image
        className="mb-8"
        src="/lade.svg"
        alt="LADE Logo"
        width={72}
        height={20}
      />
      {renderLinks}
    </nav>
  );
}
