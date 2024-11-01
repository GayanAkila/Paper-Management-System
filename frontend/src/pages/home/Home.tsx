import { Stack, Typography } from "@mui/material";
import React from "react";
import HomeHeader from "./components/HomeHeader";

const Home = () => {
  return (
    <Stack>
      <HomeHeader />
      <Typography variant="h1">paper Management System</Typography>
    </Stack>
  );
};

export default Home;
