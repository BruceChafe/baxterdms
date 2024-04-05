import React from "react";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const drawerWidth = 240;

const SidebarComponent = ({ pageName, navigationLinks }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/home"
            sx={{ color: "white", textDecoration: "none" }}
          >
            baxter.
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {navigationLinks.map((link, index) => (
            <ListItem
              key={link.to}
              disablePadding
              component={Link}
              to={link.to}
              sx={{ color: link.color || "inherit" }}
            >
              <ListItemButton>
                <ListItemText primary={link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ flexGrow: 1 }} />
        <List>
          <ListItem>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default SidebarComponent;
