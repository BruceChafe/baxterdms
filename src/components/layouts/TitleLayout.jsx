import React, { useState } from "react";
import { Box, Divider, Button, IconButton, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ResponsiveSidebar from "../sidebar/ResponsiveSidebar";

const TitleLayout = ({ title, actionButtons = [], isEditable, onToggleEdit, collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      <ResponsiveSidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        handleMobileToggle={handleMobileToggle} 
      />
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
          {isMobile && (
            <IconButton
              onClick={handleMobileToggle}
              sx={{
                ml: 2,
                backgroundColor: "white",
                border: "1px solid",
                borderRadius: "50%",
                width: 40,
                height: 40,
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default TitleLayout;
