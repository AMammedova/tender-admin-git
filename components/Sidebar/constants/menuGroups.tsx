import React from "react";
import CalendarIcon from "@/components/Icons/CalendarIcon";
import DashBoardIcon from "@/components/Icons/DashBoardIcon";
import ProductIcon from "@/components/Icons/ProductIcon";
import ProfileIcon from "@/components/Icons/ProfileIcon";
import SettingsIcon from "@/components/Icons/SettingsIcon";
import { TableOfContentsIcon, BookOpenText, Newspaper, MapPin, Building2, Handshake, GitBranch, BadgeCheck } from "lucide-react";

export const menuGroups = [
  {
    name: "MENU",
    menuItems: [
      {
        icon: <DashBoardIcon />,
        label: "Dashboard",
        route: "/statistics",
      },
      {
        icon: <ProductIcon />,
        label: "Products",
        route: "/products",
      },
      {
        icon: <ProductIcon />,
        label: "Tenders",
        route: "/tenders",
      },
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <CalendarIcon />,
        label: "Calendar",
        route: "/calendar",
      },

      {
        icon: <SettingsIcon />,
        label: "Settings",
        route: "#",
        children: [
          {
            icon: <SettingsIcon />,
            label: "Attributes",
            route: "/attributes",
          },
          {
            icon: <SettingsIcon />,
            label: "Attributes Section",
            route: "/attributesSection",
          }
        ]
      },
      {
        icon: <BookOpenText />,
        label: "FAQ",
        route: "/faq",
      },
      {
        icon: <Newspaper />,
        label: "News",
        route: "/news",
      },
      {
        icon: <MapPin />,
        label: "Region",
        route: "/region",
      },
      {
        icon: <Building2 />,
        label: "Organization",
        route: "/organization",
      },
      {
        icon: <Handshake />,
        label: "Partner",
        route: "/partner",
      },
      {
        icon: <GitBranch />,
        label: "Branch",
        route: "/branch",
      },
      {
        icon: <BadgeCheck />,
        label: "Brand",
        route: "/brand",
      },
      {
        icon: <TableOfContentsIcon />,
        label: "Category",
        route: "/category",
      },
      {
        icon: <ProfileIcon />,
        label: "Profile",
        route: "/profile",
      },
    ],
  },
];
