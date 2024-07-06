// ResponsiveSidebar.jsx

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, CssBaseline, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Divider, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { FaBoxArchive, FaRegIdCard, FaHouse, FaUsers, FaChartLine, FaGear, FaWarehouse } from "react-icons/fa6";
import SidebarComponent from "./SidebarComponent";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const listItemHeight = 56;


const SidebarItems = {
    home: {
      navigationLinks: [
        { text: "Contacts", to: "/contacts", icon: <FaUsers /> },
        { text: "Leads", to: "/leads", icon: <FaChartLine /> },
        { text: "Account Overview", to: "/account/overview", icon: <FaHouse /> },
        { text: "Configuration", to: "/configuration", icon: <FaGear /> },
        { text: "Inventory", to: "/inventory", icon: <FaWarehouse /> },
        { text: "Document Archive", to: "/documentarchive", icon: <FaBoxArchive /> },
        { text: "License Scanner", to: "/licensescanner", icon: <FaRegIdCard /> },
      ],
    },
    account: {
      pageName: "Account",
      navigationLinks: [
        { text: "Overview", to: "/account/overview", icon: <FaHouse />, color: "white" },
      ],
    },
    contacts: {
      pageName: "Contacts",
      navigationLinks: [
        { text: "Contacts", to: "/contacts", icon: <FaUsers /> },
        { text: "New Contact", to: "/contacts/newcontact", icon: <FaRegIdCard /> },
      ],
    },
    leads: {
      pageName: "Leads",
      navigationLinks: [
        { text: "Leads", to: "/leads", icon: <FaChartLine /> },
        { text: "New Lead", to: "/leads/newlead", icon: <FaRegIdCard /> },
      ],
    },
    configuration: {
      pageName: "Configuration",
      navigationLinks: [
        { text: "Configuration", to: "/configuration", icon: <FaGear /> },
      ],
    },
    inventory: {
      pageName: "Inventory",
      navigationLinks: [
        { text: "Inventory", to: "/inventory", icon: <FaWarehouse /> },
      ],
    },
    documentarchive: {
      pageName: "Document Archive",
      navigationLinks: [
        { text: "Document Archive", to: "/documentarchive", icon: <FaBoxArchive /> },
      ],
    },
    licensescanner: {
      pageName: "License Scanner",
      navigationLinks: [
        { text: "Dashboard", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Reports", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "History", to: "/licensescanner/history", icon: <FaBoxArchive /> },
        { text: "Visitors", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Groups", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Tags", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Alerts", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Locations", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Settings", to: "/licensescanner", icon: <FaBoxArchive /> },
        { text: "Access Management", to: "/licensescanner", icon: <FaBoxArchive /> },
      ],
    },
  };
const ResponsiveSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'home';
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", padding: 2 }}>
        <Tooltip title="baxter.">
          <Typography variant="h6" component={Link} to="/home" sx={{ textDecoration: "none", color: "inherit" }}>
            {collapsed ? "b." : "baxter."}
          </Typography>
        </Tooltip>
      </Box>
      <Divider />
      <List>
        {(SidebarItems[path] || SidebarItems.home).navigationLinks.map((link) => (
          <ListItem key={link.to} disablePadding component={Link} to={link.to} sx={{ height: listItemHeight }}>
            <Tooltip title={link.text} placement="right">
              <ListItemButton sx={{ justifyContent: collapsed ? "center" : "flex-start", paddingLeft: collapsed ? 2 : 3, height: listItemHeight }}>
                <ListItemIcon sx={{ minWidth: collapsed ? "auto" : 0, marginRight: collapsed ? 0 : 2 }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.text} sx={{ display: collapsed ? "none" : "block" }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ mt: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IconButton onClick={toggleDrawer} aria-label="Toggle drawer">
          <MenuIcon />
        </IconButton>
        <IconButton onClick={handleLogout} sx={{ ml: 1 }} aria-label="Logout">
          <Tooltip title="Logout">
            <LogoutIcon />
          </Tooltip>
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <CssBaseline />
      {isMobile ? (
        <>
          <IconButton onClick={handleMobileToggle} sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1201 }}>
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="bottom"
            open={mobileOpen}
            onClose={handleMobileToggle}
            sx={{ "& .MuiDrawer-paper": { width: "100%", height: "100%" } }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              <IconButton onClick={handleMobileToggle}>
                <CloseIcon />
              </IconButton>
            </Box>
            {drawerContent}
          </Drawer>
        </>
      ) : (
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
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default ResponsiveSidebar;
