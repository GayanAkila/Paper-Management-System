import React, { useEffect } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { Person, Logout } from "@mui/icons-material";
import { useState } from "react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { navItems } from "../NavItems";
import LoadingScreen from "../LoadingScreen";
import { UserRole } from "../../types/types";
import { useSnackbar } from "notistack";

const AuthenticatedLayout = () => {
  const { enqueueSnackbar } = useSnackbar();
  const common = useAppSelector((state) => state.common);
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    if (common.timestamp != null) {
      enqueueSnackbar(common.message, {
        variant: common.type,
        preventDuplicate: true,
        anchorOrigin: { horizontal: "right", vertical: "bottom" },
      });
    }
  }, [common.timestamp]);

  const userRole = user?.role as UserRole;

  const filteredNavItems = navItems.filter((item) => {
    if (!user?.role) return false;
    return item.roles.includes(user.role as UserRole);
  });

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
    handleClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const drawerWidth = 250;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          bgcolor: "white",
          borderBottom: "1px solid #E5E7EB",
          width: `100%`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          <Box
            component={"img"}
            src={require("../../assets/images/logo.png")}
            sx={{
              height: "48px",
              width: "auto",
              maxWidth: "180px",
            }}
            alt="BIS 2024"
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <IconButton color="primary">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton> */}

            <Chip
              onClick={handleMenu}
              sx={{
                height: "auto",
                padding: "8px",
                backgroundColor: "#EFF0F3",
                "&:hover": {
                  backgroundColor: "#EFF0F3",
                },
                borderRadius: "24px",
                "& .MuiChip-label": {
                  padding: 0,
                },
              }}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <Stack direction="column" spacing={0} sx={{ pl: 1 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 500, color: "#1E1F24" }}
                    >
                      {user.displayName || user.email}
                    </Typography>
                  </Stack>
                  <Avatar
                    src={user.photoURL || undefined}
                    alt={
                      user.displayName || user.email?.charAt(0).toUpperCase()
                    }
                    sx={{ width: 28, height: 28, border: "1px solid #E5E7EB" }}
                  />
                </Stack>
              }
            />
          </Box>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                width: 200,
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                mt: 1.5,
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Layout Container */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          pt: "64px", // Height of AppBar
        }}
      >
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: 250,
            height: `calc(100vh - 64px)`, // Full height minus AppBar
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 250,
              boxSizing: "border-box",
              border: "none",
              bgcolor: "transparent",
              mt: "64px", // Height of AppBar
              pl: 4,
              pt: 3,
              height: `calc(100vh - 64px)`,
            },
          }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              p: 2,
              height: "fit-content",
            }}
          >
            <List>
              {filteredNavItems.map((item) => (
                <ListItem
                  key={item.title}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    color: "#fff",
                    textDecoration: "none",
                    "&.active": {
                      bgcolor: (theme) => theme.palette.background.navBar,
                      color: (theme) => theme.palette.common.white,
                      "& .MuiListItemIcon-root": {
                        color: "#fff",
                      },
                      "& .MuiTypography-body1": {
                        color: "#fff",
                      },
                    },
                    "&:hover": {
                      bgcolor: "#DDECFE",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: "#64748B",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      // color: "#fff",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            px: 4,
            py: 3,
            height: `calc(100vh - 64px)`, // Full height minus AppBar
            overflow: "hidden",
            display: "flex",
          }}
        >
          <Box
            sx={{
              flex: 1,
              bgcolor: "white",
              borderRadius: 2,
              p: 3,
              // overflow: "auto", // This enables scrolling for content
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthenticatedLayout;
