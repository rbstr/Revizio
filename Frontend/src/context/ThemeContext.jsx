import React, { createContext, useContext, useEffect, useMemo } from "react";
import { ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import useLocalStorageState from "hooks/useLocalStorageState";
import shadows from "@mui/material/styles/shadows";

const ThemeContext = createContext({ toggleColorMode: () => { } });

export const ThemeContextProvider = ({ children }) => {
  const mobileScreen = useMediaQuery("(max-width:600px)");
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useLocalStorageState(
    "mode",
    prefersDarkMode ? "light" : "light"
  );

  //console.log(mode)

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        setThemeColor()
      },
    }),
    [setMode]
  );

  function setThemeColor() {
    var metaThemeColor = document.querySelector("meta[name=theme-color]");
    //console.log(metaThemeColor.getAttribute("content"));
    if (metaThemeColor.getAttribute("content") === "#ffff") {
      metaThemeColor.setAttribute("content", "#181818");
    } else {
      metaThemeColor.setAttribute("content", "#ffff");
    }
  }

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "'Poppins', sans-sarif",
          h1: {
            fontSize: mobileScreen ? "1.5rem" : "2.25rem",
            fontWeight: "bold",
          },
          h2: {
            fontSize: mobileScreen ? "1.375rem" : "1.875rem",
            fontWeight: "bold",
          },
          h3: {
            fontSize: mobileScreen ? "1.125rem" : "1.5rem",
            fontWeight: "600",
          },
          h4: {
            fontSize: mobileScreen ? "0.875rem" : "1.25rem",
            fontWeight: "bold",
          },

          h5: {
            fontSize: mobileScreen ? "1rem" : "1.3rem",
            fontWeight: "bold",
          },

          h5_old: {
            fontSize: mobileScreen ? "0.8rem" : "1.15rem",
            fontWeight: "bold",
          },

          h6: {
            fontSize: mobileScreen ? "0.75rem" : "1.05rem",
            fontWeight: "500",
          },

          body1: {
            fontSize: mobileScreen ? "0.75rem" : "1rem",
          },
          body2: {
            fontSize: mobileScreen ? "0.75rem" : "1rem",
            fontWeight: "500",
          },

          p1: {
            fontSize: mobileScreen ? "1.2rem" : "1.5rem",
            fontWeight: "800",
          },

          p2: {
            fontSize: mobileScreen ? "0.75rem" : "1.25rem",
            fontWeight: "600",
          },

          p3: {
            fontSize: mobileScreen ? "0.75rem" : "1.05rem",
            fontWeight: "500",
          },

          defects: {
            fontSize: mobileScreen ? "0.65rem" : "0.9rem",
            fontWeight: "500",
          },

          dropdown: {
            fontSize: mobileScreen ? "0.75rem" : "0.9rem",
            fontWeight: "400",
          },
          back: {
            fontSize: mobileScreen ? "0.75rem" : "0.97rem",
            fontWeight: "500",
          },
          subtitle2: {
            fontSize: mobileScreen ? "0.7rem" : "0.875rem",
          },
          subtitle3: {
            fontSize: mobileScreen ? "0.75rem" : "0.875rem",
            fontWeight: 400,
          },
          button: {
            textTransform: 'none',
            fontWeight: "600",
            fontSize: mobileScreen ? "0.75rem" : "0.875rem",
          },
        },
        shape: {
          borderRadius: mobileScreen ? 6 : 8,
        },
        shadows: {
          ...shadows,
          15: "0px 15px 30px rgba(0, 0, 0, 0.06)",
        },

        palette: {
          mode,
          ...(mode === "light"
            ? {
              // palette values for light mode
              primary: {
                main: "#0085FF",
                dark: "#0061B5",
              },
              secondary: {
                main: "#C4C4C4",
                calendar: "#E0E0E0",
                search: "#676767",
              },
              background: {
                default: "#FFFFFF",
                paper: "#fff",
              },

              third: {
                main: "#F2F2F2"
              },

              text: {
                primary: "#000000",
                secondary: "#C4C4C4",
                // disabled: "#F2F2F2",
                disabled: "#000000",
                green: "#09D329",
                button: "#FAFAFA",
              },
            }
            : {
              // palette values for dark mode
              primary: {
                main: "#0085FF",
              },
              secondary: {
                main: "#666666",
                calendar: "#343434",
                search: "#676767",
              },
              background: {
                paper: "#1D1D1D",
                default: "#181818",
              },

              third: {
                main: "#343434"
              },

              text: {
                primary: "#FAFAFA",
                secondary: "#666666",
                // disabled: "#292929",
                disabled: "#FAFAFA",
                green: "#09D329",
              },
            }),
        },
      }),
    [mobileScreen, mode]
  );
  return (
    <ThemeContext.Provider
      value={{ colorMode, selectedTheme: mode, mobileScreen }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  return useContext(ThemeContext);
};
