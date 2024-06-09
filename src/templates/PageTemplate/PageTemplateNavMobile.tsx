"use client";
import { useMemo } from "react";
import clsx from "clsx";
import {
  DescriptionOutlined,
  LibraryBooksOutlined,
  Person,
} from "@mui/icons-material";
import { checkPermissionLink } from "@/utils";
import { DeviceScreenType, LinkPermissionType } from "@/types";
import { PageTemplateNavMobileButton } from "./PageTemplateNavMobileButton";
import { NavLink } from "./PageTemplateNav.types";

export function PageTemplateNavMobile({
  userId = "",
  permission,
  device,
  pathname,
}: {
  userId?: string;
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
      {
        label: "User",
        href: `/profile/${userId}`,
        icon: Person,
      },
    ],
    [userId]
  );

  const renderLinks = useMemo(
    () =>
      navLinks
        .filter(({ permission: linkPerm }) =>
          checkPermissionLink(permission, linkPerm)
        )
        .map(({ label, href, icon, onClick }) => (
          <PageTemplateNavMobileButton
            key={label}
            label={label}
            href={href}
            icon={icon}
            device={device}
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
