import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
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
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthForm, authFormSchema } from "../../models/Form";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { login } from "../../store/slices/authSlice";
import { auth, db } from "../../firebase";
import GoogleIcon from "@mui/icons-material/Google";
import EmailIcon from "@mui/icons-material/Email";
import ResetPassword from "../../components/ResetPassword/ResetPassword";

const Auth = () => {
  const [authType, setAuthType] = useState<"login" | "sign-up">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState<
    string | null
  >(null);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (Boolean(user)) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handlePasswordReset = async () => {
    if (!resetPasswordEmail.length) return;
    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      setResetPasswordSuccess(
        "Password reset email sent. Please check your inbox."
      );
      setResetPasswordError(null);
    } catch (error: any) {
      setResetPasswordError(error.message);
      setResetPasswordSuccess(null);
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      if (user && user.email)
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user.photoURL || null,
            role: "user",
          })
        );
    } catch (error) {
      console.log("Error signing in:", error);
    }
  };

  const handleFormSubmit = async (data: AuthForm) => {
    setErrorMessage(null);
    setLoading(true);
    const { email, password } = data;

    try {
      if (authType === "sign-up") {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", user.uid), { email });

        if (user && user.email) {
          dispatch(
            login({
              email: user.email,
              id: user.uid,
              photoUrl: user.photoURL || null,
              role: "user",
            })
          );
        }
      } else {
        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (user && user.email) {
          dispatch(
            login({
              email: user.email,
              id: user.uid,
              photoUrl: user.photoURL || null,
              role: "user",
            })
          );
        }
      }
    } catch (error: any) {
      setErrorMessage(error.code);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthType = () => {
    setAuthType((prev) => (prev === "login" ? "sign-up" : "login"));
    setErrorMessage(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthForm>({
    resolver: yupResolver(authFormSchema),
  });

  return (
    <>
      <ResetPassword
        resetPasswordEmail={resetPasswordEmail}
        resetPasswordSuccess={resetPasswordSuccess}
        resetPasswordError={resetPasswordError}
        setResetPasswordEmail={setResetPasswordEmail}
        isOpen={resetPassword}
        onClose={() => setResetPassword(false)}
        handlePasswordReset={handlePasswordReset}
      />
      <Stack
        alignItems="center"
        justifyContent="center"
        height="100vh"
        width="100vw"
        sx={{ background: (theme) => theme.palette.background.lightBackground }}
      >
        <Stack
          width={500}
          height="auto"
          alignItems="center"
          alignContent="center"
          justifyContent="space-between"
          sx={{ background: "#fff", p: 4, borderRadius: 4 }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            {authType === "login" ? "Sign In" : "Create Account"}
          </Typography>

          {errorMessage && (
            <Typography color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <FormControl fullWidth>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ width: "100%" }}
                  {...register("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  type="password"
                  label="Password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ width: "100%" }}
                  {...register("password")}
                />
              </Grid>
              {authType === "sign-up" && (
                <Grid item xs={12}>
                  <TextField
                    id="confirm-password"
                    type="password"
                    label="Confirm Password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    sx={{ width: "100%" }}
                    {...register("confirmPassword")}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <Button
                  onClick={handleSubmit(handleFormSubmit)}
                  size="large"
                  variant="contained"
                  disabled={loading}
                  sx={{ width: "100%", mb: 2, height: 50 }}
                  endIcon={<EmailIcon />}
                >
                  {authType === "login"
                    ? "Sign in with Email"
                    : "Create Account"}
                </Button>
                <Button
                  onClick={signInWithGoogle}
                  size="large"
                  variant="contained"
                  sx={{ width: "100%", mb: 2, height: 50 }}
                  endIcon={<GoogleIcon />}
                >
                  {authType === "login"
                    ? "Sign in with Google"
                    : "Sign up with Google"}
                </Button>
                <Box sx={{ textAlign: "center" }}>
                  <Typography>
                    {authType === "login" ? (
                      <>
                        Don't have an account yet?{" "}
                        <Link component="button" onClick={handleAuthType}>
                          Sign up
                        </Link>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <Link component="button" onClick={handleAuthType}>
                          Sign in
                        </Link>
                      </>
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {authType === "login" && (
              <Divider>
                <Button onClick={() => setResetPassword(true)}>
                  Forgot password?
                </Button>
              </Divider>
            )}
          </FormControl>
        </Stack>
      </Stack>
    </>
  );
};

export default Auth;
