// src/components/NavItems.tsx
import React from "react";
import {
  Dashboard,
  Person,
  Settings,
  Group,
  Article,
  Reviews,
  CardMembership,
  LocalPostOffice,
} from "@mui/icons-material";
import { NavItem, UserRole } from "../../types/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: React.createElement(Dashboard),
    roles: [UserRole.STUDENT],
  },
  {
    title: "Dashboard",
    path: "/admin-dashboard",
    icon: React.createElement(Dashboard),
    roles: [UserRole.ADMIN],
  },

  {
    title: "Feedback Panel",
    path: "/feedback-panel",
    icon: React.createElement(Reviews),
    roles: [UserRole.REVIEWER],
  },
  {
    title: "Users",
    path: "/users",
    icon: React.createElement(Group),
    roles: [UserRole.ADMIN],
  },
  {
    title: "Papers",
    path: "/papers",
    icon: React.createElement(Article),
    roles: [UserRole.ADMIN],
  },
  {
    title: "Certificates",
    path: "/certificates",
    icon: React.createElement(CardMembership),
    roles: [UserRole.ADMIN],
  },
  {
    title: "Letters",
    path: "/letters",
    icon: React.createElement(LocalPostOffice),
    roles: [UserRole.ADMIN],
  },
  {
    title: "Profile",
    path: "/profile",
    icon: React.createElement(Person),
    roles: [UserRole.ADMIN, UserRole.REVIEWER, UserRole.STUDENT],
  },
  {
    title: "Settings",
    path: "/settings",
    icon: React.createElement(Settings),
    roles: [UserRole.ADMIN],
  },
];
