import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    const themes = {
        // Dark Modes
        dark: createTheme({
            palette: {
                mode: 'dark',
            },
        }),
        vaporWaveTheme: createTheme({
            palette: {
                mode: 'light',
                background: {
                    default: '#f3e8fd',
                    paper: '#d1d1ff',
                },
                primary: {
                    main: '#a64dff',
                },
                secondary: {
                    main: '#ff66ff',
                },
                text: {
                    primary: '#2c2c54',
                    secondary: '#7f8c8d',
                },
            },
            typography: {
                
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#ff66ff',
                },
                h2: {
                
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#a64dff',
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        // Additional Lighter Themes
        luminousMorningTheme: createTheme({
            palette: {
                mode: 'light',
                background: {
                    default: '#f5f5f5', // Light gray background color
                    paper: '#ffffff',   // White paper color
                },
                primary: {
                    main: '#64b5f6',     // Sky blue color
                },
                secondary: {
                    main: '#ff8a65',     // Deep orange accent color
                },
                text: {
                    primary: '#333333',  // Dark gray text color
                    secondary: '#666666', // Medium gray secondary text color
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#ff8a65', // Deep orange color for headings
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#64b5f6', // Sky blue color for subheadings
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        whimsicalMeadowTheme: createTheme({
            palette: {
                mode: 'light',
                background: {
                    default: '#e6f7ec',
                    paper: '#d1f0ff',
                },
                primary: {
                    main: '#4caf50',
                },
                secondary: {
                    main: '#2196f3',
                },
                text: {
                    primary: '#37474f',
                    secondary: '#546e7a',
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#2196f3',
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#4caf50',
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        cottonCandyDreamTheme: createTheme({
            palette: {
                mode: 'light',
                background: {
                    default: '#fff5e1',
                    paper: '#ffe0b2',
                },
                primary: {
                    main: '#ff9800',
                },
                secondary: {
                    main: '#9c27b0',
                },
                text: {
                    primary: '#333333',
                    secondary: '#616161',
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#9c27b0',
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#ff9800',
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        // Dark Mode Themes
        midnightMystiqueTheme: createTheme({
            palette: {
                mode: 'dark',
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
                primary: {
                    main: '#64ffda',
                },
                secondary: {
                    main: '#ff4081',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#9e9e9e',
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#ff4081',
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#64ffda',
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        shadowyForestTheme: createTheme({
            palette: {
                mode: 'dark',
                background: {
                    default: '#263238',
                    paper: '#37474f',
                },
                primary: {
                    main: '#ffeb3b',
                },
                secondary: {
                    main: '#e91e63',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#bdbdbd',
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#e91e63',
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#ffeb3b',
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        cosmicNebulaTheme: createTheme({
            palette: {
                mode: 'dark',
                background: {
                    default: '#1a1a1a',
                    paper: '#222222',
                },
                primary: {
                    main: '#ff6f61',
                },
                secondary: {
                    main: '#76c7c0',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#b0b0b0',
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#76c7c0',
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#ff6f61',
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),

        obsidianDreamTheme: createTheme({
            palette: {
                mode: 'dark',
                background: {
                    default: '#121212', // Dark background color
                    paper: '#1e1e1e',   // Dark paper color
                },
                primary: {
                    main: '#607d8b',     // Blue-gray color
                },
                secondary: {
                    main: '#c2185b',     // Dark pink accent color
                },
                text: {
                    primary: '#ffffff',  // White text color
                    secondary: '#bdbdbd', // Gray secondary text color
                },
            },
            typography: {
                h1: {
                    fontSize: '3rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    color: '#c2185b', // Dark pink color for headings
                },
                h2: {
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#607d8b', // Blue-gray color for subheadings
                },
                body1: {
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                },
            },
            shape: {
                borderRadius: 8,
            },
        }),
    };

    const toggleTheme = (selectedTheme) => {
        setTheme(selectedTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <MuiThemeProvider theme={themes[theme]}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
