import React from "react";
import { NavItem } from "../utils/types";
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  Settings,
  EventNote,
  Group,
  AdminPanelSettings,
  Logout,
  Article,
  Notifications,
  Reviews,
  CardMembership,
  LocalPostOffice,
} from "@mui/icons-material";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: React.createElement(Dashboard),
    roles: ["user", "admin", "reviewer"],
  },
  {
    title: "Profile",
    path: "/profile",
    icon: React.createElement(Person),
    roles: ["user", "admin", "reviewer"],
  },
  {
    title: "Feedback Panel",
    path: "/feedback-panel",
    icon: React.createElement(Reviews),
    roles: ["user", "admin", "reviewer"],
  },
  {
    title: "Dashboard",
    path: "/admin-dashboard",
    icon: React.createElement(Dashboard),
    roles: ["admin", "reviewer", "user"],
  },
  {
    title: "Users",
    path: "/users",
    icon: React.createElement(Group),
    roles: ["admin", "reviewer", "user"],
  },
  {
    title: "Reviewers",
    path: "/reviewers",
    icon: React.createElement(Reviews),
    roles: ["admin", "reviewer", "user"],
  },
  {
    title: "Papers",
    path: "/papers",
    icon: React.createElement(Article),
    roles: ["admin", "reviewer", "user"],
  },
  {
    title: "Certificates",
    path: "/certificates",
    icon: React.createElement(CardMembership),
    roles: ["admin", "reviewer", "user"],
  },
  {
    title: "letters",
    path: "/letters",
    icon: React.createElement(LocalPostOffice),
    roles: ["admin", "reviewer", "user"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: React.createElement(Settings),
    roles: ["admin", "reviewer", "user"],
  },
];
