import React, { useState } from "react";
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
  ListItemText,
  Backdrop,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
// import EmailContact from "../crm/EmailContact";

const ContactSidebarComponent = ({
  contact,
  navigationLinks,
  onNavigationLinkClick,
}) => {
  navigationLinks = [
    { text: "Basic Information" },
    { text: "Leads" },
    { text: "Vehicles" },
    { text: "Sales" },
    { text: "Finance" },
  ];
  const drawerWidth = 300;
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(null);

  const handleEmailClick = () => {
    setIsEmailPaperOpen(true);
  };

  const handleCloseEmailPaper = () => {
    setIsEmailPaperOpen(null);
  };

  return (
    <React.Fragment>
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
            <Typography variant="h6">
              {contact.firstName} {contact.lastName}
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleEmailClick}>
                <ListItemIcon>
                  <EmailOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  <div>
                    <Typography variant="body2">
                      {contact.email || "null"}
                    </Typography>
                  </div>
                </ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleEmailClick}>
                <ListItemIcon>
                  <SmsOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  <div>
                    <Typography variant="body2">
                      {contact.phoneNumbers?.mobilePhone || "null"}
                    </Typography>
                  </div>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
          <List>
            {navigationLinks &&
              navigationLinks.map((link, index) => (
                <ListItem
                  key={index}
                  disablePadding
                  onClick={() => onNavigationLinkClick(link.text)}
                >
                  <ListItemButton>
                    <ListItemText
                      primary={link.text}
                      style={{ color: link.color }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Drawer>

        {isEmailPaperOpen && (
          <>
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isEmailPaperOpen}
              onClick={handleCloseEmailPaper}
            />
            <EmailContact
              contact={contact}
              showPanel
              onClose={handleCloseEmailPaper}
            />
          </>
        )}
      </Box>
    </React.Fragment>
  );
};

export default ContactSidebarComponent;
