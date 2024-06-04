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
import { DeviceScreenType, LinkPermissionType, RoleType } from "@/types";
import { PageTemplateNavMobileButton } from "./PageTemplateNavMobileButton";

interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  main?: boolean;
  danger?: boolean;
  icon: SvgIconComponent;
  permission?: LinkPermissionType;
}

interface NavGroup {
  name: string;
  links: NavLink[];
  permission?: LinkPermissionType;
}

export function PageTemplateNavMobile({
  permission,
  device,
  pathname,
}: {
  permission: LinkPermissionType;
  device: DeviceScreenType;
  pathname: string | null;
}) {
  const navLinks = useMemo<NavLink[]>(
    () => [
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
    ],
    []
  );

  const renderLinks = useMemo(
    () =>
      navLinks
        .filter(({ permission: linkPerm }) =>
          checkPermissionLink(permission, linkPerm)
        )
        .map(({ label, href, icon, danger, onClick }) => (
          <PageTemplateNavMobileButton
            key={label}
            label={label}
            href={href}
            icon={icon}
            device={device}
            isDanger={danger}
            isActive={href === pathname}
            onClick={onClick}
          />
        )),
    [device, navLinks, pathname, permission]
  );

  return (
    <nav
      className={clsx(
        "flex flex-row",
        "border-secondary-300 border-t",
        "w-full justify-evenly"
      )}
    >
      {renderLinks}
    </nav>
  );
}
