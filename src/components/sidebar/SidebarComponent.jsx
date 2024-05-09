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
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  IconButton,
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
    justifyContent: "flex-start",
    padding: 2,
    flexGrow: 0,
  }}
>
  {collapsed ? null : (
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
                {/* <ListItemIcon> */}
                  {/* Optional: Display an icon here if each link has associated icons */}
                {/* </ListItemIcon> */}
                <ListItemText primary={collapsed ? "" : link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        {/* <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton> */}
        <Box
          sx={{ mt: "auto", mb: 2, display: "flex", justifyContent: "center" }}
        >
          <IconButton onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SidebarComponent;
