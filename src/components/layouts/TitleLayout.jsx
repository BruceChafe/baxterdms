import React from "react";
import { Box, Divider, Button } from "@mui/material";

const TitleLayout = ({ title, actionButtons = [], isEditable, onToggleEdit }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ m: 1 }}>{title}</Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {onToggleEdit && (
            <Button onClick={onToggleEdit} variant="outlined" sx={{ mr: 2 }}>
              {isEditable ? "Save" : "Edit"}
            </Button>
          )}
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              {button.label}
            </Button>
          ))}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default TitleLayout;
