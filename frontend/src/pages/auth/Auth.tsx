import { SetStateAction, useEffect, useState } from "react";
import { useAppDispatch } from "../../store/store";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthForm, authFormSchema } from "../../models/Form";
import { login } from "../../store/slices/authSlice";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "../../services/firebase";
import { UserProfile } from "../../types/types";

const Auth = () => {
  const [authType, setAuthType] = useState<"login" | "sign-up">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthForm>({
    resolver: yupResolver(authFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    reset();
    setErrorMessage(null);
  }, [authType, reset]);

  const handleUserAuthentication = (userProfile: UserProfile) => {
    dispatch(login(userProfile));
    navigate("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const userProfile = await signInWithGoogle();
      handleUserAuthentication(userProfile);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (data: AuthForm) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      let userProfile: UserProfile;

      if (authType === "sign-up") {
        userProfile = await signUpWithEmail(data.email, data.password);
      } else {
        userProfile = await signInWithEmail(data.email, data.password);
      }

      handleUserAuthentication(userProfile);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{ background: (theme) => theme.palette.background.default }}
    >
      <Stack
        width={500}
        spacing={3}
        sx={{
          background: "#fff",
          p: 4,
          borderRadius: 2,
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h4" align="center">
          {authType === "login" ? "Sign In" : "Create Account"}
        </Typography>

        {errorMessage && (
          <Alert severity="error" variant="filled">
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
              fullWidth
            />

            <TextField
              type="password"
              label="Password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              fullWidth
            />

            {authType === "sign-up" && (
              <TextField
                type="password"
                label="Confirm Password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={loading}
                fullWidth
              />
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} /> : <EmailIcon />
              }
              fullWidth
            >
              {authType === "login" ? "Sign In" : "Sign Up"} with Email
            </Button>

            <Button
              onClick={handleGoogleSignIn}
              variant="outlined"
              disabled={loading}
              startIcon={<GoogleIcon />}
              fullWidth
            >
              Continue with Google
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                {authType === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setAuthType("sign-up")}
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => setAuthType("login")}
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </Typography>
            </Box>

            {authType === "login" && (
              <Divider>
                <Button
                  onClick={() => setResetPassword(true)}
                  disabled={loading}
                >
                  Forgot password?
                </Button>
              </Divider>
            )}
          </Stack>
        </form>
      </Stack>

      <ResetPassword
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
        handlePasswordReset={function (): Promise<void> {
          throw new Error("Function not implemented.");
        }}
        resetPasswordEmail={""}
        resetPasswordSuccess={null}
        resetPasswordError={null}
        setResetPasswordEmail={function (value: SetStateAction<string>): void {
          throw new Error("Function not implemented.");
        }}
      />
    </Stack>
  );
};

export default Auth;
