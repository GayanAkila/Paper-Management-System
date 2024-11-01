import {
  AppBar,
  Box,
  Avatar,
  Link as MuiLink,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const HomeHeader = () => {
  const navItems = [
    ["home", "/"],
    ["User", "/auth"],
  ];

  return (
    <>
      <AppBar component="nav" position="fixed">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            BISSS
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item[0]}
                sx={{ color: "#fff" }}
                component={RouterLink}
                to={item[1]}
              >
                {item[0]}
              </Button>
            ))}
          </Box>
          <MuiLink component={RouterLink} to="/profile">
            <Avatar src="" alt="avatar" />
          </MuiLink>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default HomeHeader;
