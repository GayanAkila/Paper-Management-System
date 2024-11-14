import { createTheme } from "@mui/material";

// color design tokens export
export const tokens = () => ({
  grey: {
    100: "#000000",
    200: "#1E1F24",
    300: "#62636C",
    400: "#80828D",
    500: "#8B8D98",
    600: "#B9BBC6",
    700: "#CDCED7",
    800: "#D8D9E0",
    900: "#E0E1E6",
    1000: "#E7E8EC",
    1100: "#EFF0F3",
    1200: "#F9F9FB",
    1300: "#FCFCFD",
  },
  primary: {
    100: "#143559",
    200: "#2875C6",
    300: "#1E6CBD",
    400: "#2E7ACC",
    500: "#7FADE3",
    600: "#A2C4ED",
    700: "#BAD5F5",
    800: "#CDE2FC",
    900: "#DDECFE",
    1000: "#F6F9FE",
    1100: "#FCFDFF",
    1200: "#FFFFFF",
  },
});

const colors = tokens();

declare module "@mui/material/styles" {
  interface TypeBackground {
    lightBackground?: string;
    icon?: string;
    mainText?:string;
  }

  interface PaletteOptions {
    background?: Partial<TypeBackground>;
  }
}

// mui theme settings
const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[200],
    },
    secondary: {
      main: colors.primary[100],
    },
    background: {
      default: colors.primary[1200],
      paper: colors.primary[1000],
      lightBackground: colors.primary[1000],
      icon: colors.primary[100],
      mainText:colors.primary[100],
    },
    text: {
      primary: colors.primary[100], // Primary text color
      secondary: colors.grey[200], // Secondary text color
    },
    // You can add more custom colors here if needed
    success: {
      main: "#28a745",
    },
    error: {
      main: "#dc3545",
    },
    warning: {
      main: "#ffc107",
    },
    info: {
      main: "#17a2b8",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif", // Set default font family
    h4: {
      fontWeight: 700,
      color: "#143559",
    },
    body1: {
      fontWeight: 400,
      color: "#3d5a80",
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 8, // Default border-radius for components
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          textTransform: "none", // Removes uppercase transformation
          borderRadius: 24, // Adds border-radius to button
          "&:hover": {
            boxShadow: "none", // Disables box-shadow on hover
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "4px",
          "&:hover": {
            background: "#666",
          },
        },
      },
    },
  },
});

export default theme;
