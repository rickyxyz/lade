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
  ArrowDropDown,
  AssignmentOutlined,
  EmojiEventsOutlined,
  LightbulbOutlined,
  Logout,
  Menu,
  SvgIconComponent,
} from "@mui/icons-material";
import { List } from "@mui/material";

interface NavLink {
  label: string;
  href: string;
  icon: SvgIconComponent;
}

interface NavGroup {
  name: string;
  links: NavLink[];
}

export function PageTemplateNavNew() {
  const auth = getAuth();
  const user = useAppSelector("user");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const debounce = useDebounce();
  const stateMobileLinks = useState(false);
  const setMobileLinks = stateMobileLinks[1];
  const { device } = useDevice();
  const pathname = usePathname();

  const navLinks = useMemo<NavGroup[]>(
    () => [
      {
        name: "MAIN",
        links: [
          {
            label: "Problems",
            href: "/",
            icon: LightbulbOutlined,
          },
          {
            label: "Contests",
            href: "/contests",
            icon: AssignmentOutlined,
          },
          {
            label: "Leaderboard",
            href: "/leaderboard",
            icon: EmojiEventsOutlined,
          },
        ],
      },
    ],
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
              element: <IconText IconComponent={Logout} text="Logout" />,
              onClick: logout,
            },
          ]}
          triggerElement={
            <User
              className="relative"
              username={user.id}
              hideName={device === "mobile"}
              captionElement={
                device !== "mobile" && (
                  <Icon
                    className="ml-2"
                    IconComponent={ArrowDropDown}
                    size="s"
                  />
                )
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
    [device, router, user]
  );

  const renderLinks = useMemo(
    () =>
      navLinks.map(({ name, links }) => (
        <div className="flex flex-col gap-1" key={name}>
          <Paragraph weight="semibold" color="secondary-4">
            {name}
          </Paragraph>
          {links.map(({ label, href, icon }) => (
            <PageTemplateNavButton
              key={label}
              label={label}
              href={href}
              icon={icon}
              active={href === pathname}
            />
          ))}
        </div>
      )),
    [navLinks, pathname]
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
        "flex flex-col h-full",
        "border-gray-300 border-r",
        "px-6 py-4"
      )}
      style={{
        minWidth: "240px",
      }}
    >
      {device === "mobile" && (
        <PageTemplateNavButton
          className="!px-6"
          onClick={() => {
            setMobileLinks((prev) => !prev);
          }}
        >
          <List />
        </PageTemplateNavButton>
      )}
      <Image
        className="mb-8"
        src="/lade.svg"
        alt="LADE Logo"
        width={72}
        height={20}
      />
      {device !== "mobile" && renderLinks}
    </nav>
  );
}
