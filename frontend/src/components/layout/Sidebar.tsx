import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/store";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Description as PaperIcon,
  Person as ProfileIcon,
  Assessment as ReviewIcon,
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  // Define menu items based on user role
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
      roles: ["student", "reviewer", "admin"],
    },
    {
      text: "My Papers",
      icon: <PaperIcon />,
      path: "/papers",
      roles: ["student"],
    },
    {
      text: "Reviews",
      icon: <ReviewIcon />,
      path: "/reviews",
      roles: ["reviewer"],
    },
    {
      text: "Profile",
      icon: <ProfileIcon />,
      path: "/profile",
      roles: ["student", "reviewer", "admin"],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
          borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      <Toolbar />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.12)",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? "#1976d2" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  color:
                    location.pathname === item.path ? "#1976d2" : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
