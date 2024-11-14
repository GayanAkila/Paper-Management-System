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
    title: "Events",
    path: "/events",
    icon: React.createElement(EventNote),
    roles: ["admin", "reviewer"],
  },
  {
    title: "User Management",
    path: "/users",
    icon: React.createElement(Group),
    roles: ["admin"],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: React.createElement(Settings),
    roles: ["admin"],
  },
  {
    title: "Content Management",
    path: "/content",
    icon: React.createElement(Article),
    roles: ["admin", "reviewer"],
  },
];
