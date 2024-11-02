import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Avatar,
  Link as MuiLink,
  Toolbar,
  Typography,
  Button,
  Slide,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

const HomeHeader = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setPrevScrollPos(currentScrollPos);
      setVisible(visible);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <Slide appear={false} direction="down" in={visible}>
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 1),
          backdropFilter: "blur(10px)",
          color: (theme) => theme.palette.text.primary,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Toolbar
          className="justify-between"
          sx={{
            ml: 16,
            mr: 16,
            transition: "all 0.3s ease-in-out",
            height: visible ? "64px" : "56px", // Slightly smaller when scrolling
          }}
        >
          <Box
            className="h-12"
            component={"img"}
            src={require("../../../assets/images/logo.png")}
            width={180}
            alt="BIS 2024"
            sx={{
              transition: "all 0.3s ease-in-out",
              transform: visible ? "scale(1)" : "scale(0.9)",
            }}
          />
          <Box className="flex items-center gap-6">
            <Typography
              color="inherit"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Home
            </Typography>
            <Typography
              color="inherit"
              sx={{
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
            >
              About
            </Typography>
            <Typography
              color="inherit"
              sx={{
                "&:hover": {
                  color: "primary.main",
                  cursor: "pointer",
                },
              }}
            >
              Proceeding Books
            </Typography>
            <Typography
              color="inherit"
              component={RouterLink}
              to="/auth"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Sign in
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/register"
              sx={{
                transition: "all 0.3s ease-in-out",
                transform: visible ? "scale(1)" : "scale(0.95)",
              }}
            >
              Register Now
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  );
};

export default HomeHeader;
