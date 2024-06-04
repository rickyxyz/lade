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
import { PageTemplateNavDesktopButton } from "./PageTemplateNavDesktopButton";
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
import { DeviceScreenType, LinkPermissionType, RoleType } from "@/types";

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

export function PageTemplateNavDesktop({
  permission,
  device,
  pathname,
}: {
  permission: LinkPermissionType,
  device: DeviceScreenType,
  pathname: string | null,
}) {
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
      <div>
        {navLinks
          .filter(({ permission: linkPerm }) =>
            checkPermissionLink(permission, linkPerm)
          )
          .map(({ name, links }, index) => (
            <div className={clsx("flex flex-col gap-1")} key={name}>
              <Paragraph
                className={clsx(index > 0 && "mt-8")}
                weight="semibold"
                color="secondary-4"
              >
                {name}
              </Paragraph>
              {links
                .filter(({ permission: linkPerm }) =>
                  checkPermissionLink(permission, linkPerm)
                )
                .map(({ label, href, icon, danger, onClick }) => (
                  <PageTemplateNavDesktopButton
                    key={label}
                    label={label}
                    href={href}
                    icon={icon}
                    device={device}
                    isDanger={danger}
                    isActive={href === pathname}
                    onClick={onClick}
                  />
                ))}
            </div>
          ))}
      </div>
    ),
    [device, navLinks, pathname, permission]
  );

  return (
    <nav
      className={clsx(
        "flex flex-col",
        "border-secondary-300 border-r",
        "py-4",
        "min-w-[240px]",
        "px-6"
      )}
    >
      {device === "desktop" && (
        <Image
          className="mb-8"
          src="/lade.svg"
          alt="LADE Logo"
          width={72}
          height={20}
        />
      )}
      {renderLinks}
    </nav>
  );
}
