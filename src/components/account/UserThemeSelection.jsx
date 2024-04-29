import React from "react";
import { Button, Paper, Typography, Box, Stack } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const UserThemeSelection = () => {
  const { themes, currentTheme, toggleTheme } = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>
          Theme Selection
        </Typography>
        {themes && Object.keys(themes).length > 0 ? (
          Object.keys(themes).map((themeName) => (
            <Stack key={themeName}>
              <Button
                onClick={() => toggleTheme(themeName)}
                variant={currentTheme === themeName ? "contained" : "outlined"}
                color="secondary"
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  p: 1,
                  cursor: "pointer",
                  width: "15%",
                }}
              >
                {themeName}
              </Button>
            </Stack>
          ))
        ) : (
          <Typography variant="body1">No themes available.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default UserThemeSelection;
