import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import ResetPassword from "../../components/ResetPassword/ResetPassword";
import { login } from "../../store/slices/authSlice";
import { registerUser, loginUser } from "../../services/authService";
import { signInWithGoogle } from "../../services/firebase";
import { UserProfile } from "../../types/types";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth = () => {
  const [authType, setAuthType] = useState<"login" | "sign-up">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFormErrors({});
    setErrorMessage(null);
  }, [authType]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (authType === "sign-up") {
      // Validate all fields for sign-up
      if (!formData.name.trim()) {
        errors.name = "Name is required";
        isValid = false;
      }

      if (!formData.email) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!validateEmail(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }

      if (!formData.password) {
        errors.password = "Password is required";
        isValid = false;
      } else if (!validatePassword(formData.password)) {
        errors.password =
          "Password must be at least 8 characters long and contain uppercase, lowercase, and numbers";
        isValid = false;
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    } else {
      // Only validate required fields for sign-in
      if (!formData.email) {
        errors.email = "Email is required";
        isValid = false;
      }

      if (!formData.password) {
        errors.password = "Password is required";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleUserAuthentication = (userProfile: UserProfile) => {
    dispatch(login(userProfile));
    navigate("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const userProfile = await signInWithGoogle();
      if (!userProfile.idToken || !userProfile.refreshToken) {
        throw new Error("Missing authentication tokens");
      }
      handleUserAuthentication(userProfile);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrorMessage(null);
    setLoading(true);

    try {
      let userProfile: UserProfile;

      if (authType === "sign-up") {
        const registerResponse = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "student",
        });
        setAuthType("login");
        setErrorMessage("Account created successfully. Please sign in.");
      } else {
        const loginResponse = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        userProfile = { ...loginResponse.user, uid: loginResponse.user.uid };
        handleUserAuthentication(userProfile);
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setErrorMessage(error.response?.data?.message || "An error occurred.");
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
          <Alert severity={authType === "sign-up" ? "success" : "error"}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleFormSubmit}>
          <Stack spacing={2}>
            {authType === "sign-up" && (
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                disabled={loading}
                fullWidth
              />
            )}

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
              fullWidth
            />

            <TextField
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              fullWidth
            />

            {authType === "sign-up" && (
              <TextField
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
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
        handlePasswordReset={async () => {}}
        resetPasswordEmail={formData.email}
        resetPasswordSuccess={""}
        resetPasswordError={""}
        setResetPasswordEmail={() => {}}
      />
    </Stack>
  );
};

export default Auth;
