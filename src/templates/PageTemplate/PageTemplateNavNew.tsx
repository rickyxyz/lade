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

interface NavLink {
  label: string;
  href: string;
  icon: SvgIconComponent;
  danger?: boolean;
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
          ...(user
            ? [
                {
                  label: "New Problem",
                  href: "/problem/new",
                  icon: NoteAddOutlined,
                },
                {
                  label: "New Contest",
                  href: "/contest/new",
                  icon: AddToPhotosOutlined,
                },
              ]
            : []),
        ],
      },
      {
        name: "Account",
        links: user
          ? [
              {
                label: "You",
                href: "/user",
                icon: Person,
              },
              {
                label: "Log Out",
                href: "/logout",
                icon: Logout,
                danger: true,
              },
            ]
          : [
              {
                label: "Sign Up",
                href: "/signup",
                icon: PersonAddAltOutlined,
              },
              {
                label: "Log In",
                href: "/login",
                icon: LoginOutlined,
              },
            ],
      },
    ],
    [user]
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
    () => (
      <div className="flex-grow">
        {navLinks.map(({ name, links }, index) => (
          <div className={clsx("flex flex-col gap-1")} key={name}>
            {index > 0 && device !== "desktop" && <hr className="mt-2 mb-1" />}
            {device === "desktop" && (
              <Paragraph
                className={clsx(index > 0 && "mt-8")}
                weight="semibold"
                color="secondary-4"
              >
                {name}
              </Paragraph>
            )}
            {links.map(({ label, href, icon, danger }) => (
              <PageTemplateNavButton
                key={label}
                label={label}
                href={href}
                icon={icon}
                device={device}
                danger={danger}
                active={href === pathname}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    [device, navLinks, pathname]
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
        "border-gray-300 border-r",
        "py-4",
        device === "desktop" ? "px-6" : "px-2"
      )}
      style={
        device === "desktop"
          ? {
              minWidth: "240px",
            }
          : {
              width: "58px",
            }
      }
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
