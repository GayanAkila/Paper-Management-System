import React from "react";
import { useAppSelector } from "../../store/store";
import {
  Box,
  Button,
  FormControl,
  Link,
  Grid,
  Stack,
  TextField,
  Typography,
  Divider,
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";

const Auth = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <>
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        height={"100vh"}
        width={"100vw"}
        sx={{ background: "#fff2f2" }}
      >
        <Stack
          width={450}
          height={450}
          alignItems={"center"}
          alignContent={"center"}
          justifyContent={"center"}
          sx={{ background: "#fff", p: 4, borderRadius: 4 }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Sign In
          </Typography>
          <FormControl fullWidth>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField id="email" label="Email" sx={{ width: "100%" }} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  type="password"
                  label="Password"
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="comfirm-password"
                  type="password"
                  label="Confirm Password"
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button size="large" variant="contained">
                  Sign in with Email
                </Button>
                <Typography>
                  Don't have an account yet?
                  <Link component={RouterLink} to="/signup">
                    SignUp
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Divider>Forgot Password</Divider>
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
};

export default Auth;
