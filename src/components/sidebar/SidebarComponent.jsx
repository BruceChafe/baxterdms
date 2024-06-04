import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const SidebarComponent = ({ navigationLinks, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const toggleDrawer = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? 80 : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: collapsed ? 80 : drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: 2,
            flexGrow: 0,
          }}
        >
          {collapsed ? (
            <Tooltip title="baxter.">
              <Typography
                variant="h6"
                component={Link}
                to="/home"
                sx={{ textDecoration: "none", color: "inherit" }}
              >
                B
              </Typography>
            </Tooltip>
          ) : (
            <Typography
              variant="h6"
              component={Link}
              to="/home"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              baxter.
            </Typography>
          )}
        </Box>
        <Divider />
        <List>
          {navigationLinks.map((link) => (
            <ListItem key={link.to} disablePadding>
              <ListItemButton component={Link} to={link.to}>
                <ListItemText primary={collapsed ? "" : link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={handleLogout} sx={{ ml: 1 }}>
            <Tooltip title="Logout">
              <LogoutIcon />
            </Tooltip>
          </IconButton>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SidebarComponent;
