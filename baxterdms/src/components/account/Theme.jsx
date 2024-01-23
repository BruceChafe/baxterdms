import React, { useState } from "react";
import { Button, Paper, Typography, Divider } from "@mui/material";

import { useTheme } from "../../context/ThemeContext";

const ThemeSelection = () => {
  const { themes, theme, toggleTheme } = useTheme();

  return (
    <Paper
    sx={{
      mt: 5,
      mr: 2,
      p: 10,
    }}
  >      {themes ? (
        <>
      <Typography variant="h4" sx={{mb: 2 }}>Theme</Typography>
          <Divider sx={{mb: 2 }} />
          {Object.keys(themes).map((themeName) => (
            <Button
              key={themeName}
              onClick={() => toggleTheme(themeName)}
              variant={theme === themeName ? "contained" : "outlined"}
              color="primary"
              style={{
                marginRight: "10px",
                borderRadius: "4px",
                padding: "10px 15px",
                cursor: "pointer",
                transition: "background 0.3s, color 0.3s, border 0.3s",
              }}
            >
              {themeName}
            </Button>
          ))}
        </>
      ) : null}
    </Paper>
  );
};

export default ThemeSelection;
