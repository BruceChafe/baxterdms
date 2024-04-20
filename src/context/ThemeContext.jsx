import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import { AuthContext } from "./AuthContext";
import UserData from "../components/account/UserData";
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase";

const ThemeContext = createContext();

const themes = {
  "Default Dark Theme": createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#263238", // Deep blue-gray background
        paper: "#37474F", // Slightly lighter panel background
      },
      primary: {
        main: "#FFC107", // Fresh green for primary elements
      },
      secondary: {
        main: "#FFC107", // Vivid yellow for secondary elements
      },
      text: {
        primary: "#FFFFFF", // White text for high contrast
        secondary: "#B0BEC5", // Subdued light blue-gray for secondary text
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      h1: {
        fontSize: "3rem", // Larger font size for emphasis
        fontWeight: 700, // Bolder font weight for heading
        color: "#FFFFFF", // White color for headings
        marginBottom: "1rem", // Improved spacing below headings
      },
      h2: {
        fontSize: "2.5rem", // Slightly smaller font size for subheadings
        fontWeight: 600, // Slightly bolder font weight
        color: "#FFFFFF",
        marginBottom: "1rem",
      },
      body1: {
        fontSize: "1rem", // Standard font size for body text
        lineHeight: 1.6, // Improved line height for readability
        color: "#B0BEC5",
        marginBottom: "0.5rem",
      },
      // Add more typography styles as needed
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8, // Use a consistent spacing scale for better alignment
    shadows: [
      "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      "0px 8px 16px rgba(0, 0, 0, 0.1)", // Slightly stronger shadow for modals or elevated elements
    ],
    // Add more styling properties as needed
  }),
  "Dark Blue": createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#1A237E", // Royal blue background
        paper: "#283593", // Slightly darker panel background
      },
      primary: {
        main: "#FFC107", // Royal blue for primary elements
      },
      secondary: {
        main: "#FFC107", // Vivid yellow for secondary elements
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#B0BEC5",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      h1: {
        fontSize: "3rem", // Larger font size for emphasis
        fontWeight: 700, // Bolder font weight for heading
        color: "#FFFFFF", // White color for headings
        marginBottom: "1rem", // Improved spacing below headings
      },
      h2: {
        fontSize: "2.5rem", // Slightly smaller font size for subheadings
        fontWeight: 600, // Slightly bolder font weight
        color: "#FFFFFF",
        marginBottom: "1rem",
      },
      body1: {
        fontSize: "1rem", // Standard font size for body text
        lineHeight: 1.6, // Improved line height for readability
        color: "#B0BEC5",
        marginBottom: "0.5rem",
      },
      // Add more typography styles as needed
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8, // Use a consistent spacing scale for better alignment
    shadows: [
      "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      "0px 8px 16px rgba(0, 0, 0, 0.1)", // Slightly stronger shadow for modals or elevated elements
    ],
    // Add more styling properties as needed
  }),
  "Dark Green": createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#004D40", // Deep green background
        paper: "#00695C", // Slightly darker panel background
      },
      primary: {
        main: "#FFC107", // Fresh green for primary elements
      },
      secondary: {
        main: "#FFC107", // Vivid yellow for secondary elements
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#B0BEC5",
      },
    },
    typography: {
      fontFamily: "Roboto, sans-serif",
      h1: {
        fontSize: "3rem", // Larger font size for emphasis
        fontWeight: 700, // Bolder font weight for heading
        color: "#FFFFFF", // White color for headings
        marginBottom: "1rem", // Improved spacing below headings
      },
      h2: {
        fontSize: "2.5rem", // Slightly smaller font size for subheadings
        fontWeight: 600, // Slightly bolder font weight
        color: "#FFFFFF",
        marginBottom: "1rem",
      },
      body1: {
        fontSize: "1rem", // Standard font size for body text
        lineHeight: 1.6, // Improved line height for readability
        color: "#B0BEC5",
        marginBottom: "0.5rem",
      },
      // Add more typography styles as needed
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8, // Use a consistent spacing scale for better alignment
    shadows: [
      "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
      "0px 8px 16px rgba(0, 0, 0, 0.1)", // Slightly stronger shadow for modals or elevated elements
    ],
    // Add more styling properties as needed
  }),
};

const ThemeProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState('Default Dark Theme');

  useEffect(() => {
    const fetchUserTheme = async () => {
      if (user && user.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userTheme = userData.theme;
            if (userTheme && themes[userTheme]) {
              setTheme(userTheme);
            }
          }
        } catch (error) {
          console.error('Error fetching user theme:', error);
        }
      }
    };

    fetchUserTheme();
  }, [user]);

  const toggleTheme = (selectedTheme) => {
    if (!user || !user.uid) {
      console.error('User information not available.');
      return;
    }

    if (themes[selectedTheme]) {
      setTheme(selectedTheme);
      const userDocRef = doc(db, 'users', user.uid);
      updateDoc(userDocRef, { theme: selectedTheme }).catch(error => {
        console.error('Error updating user theme:', error);
      });
    } else {
      console.error('Selected theme is not available.');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themes }}>
      <MuiThemeProvider theme={themes[theme]}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { useTheme, ThemeProvider, ThemeContext };