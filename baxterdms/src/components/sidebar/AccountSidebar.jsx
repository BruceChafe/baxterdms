// Import necessary components and libraries
import React from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactsIcon from '@mui/icons-material/Contacts';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

// Array of objects representing navigation links
const navigationLinks = [
  { text: 'Profile', to: '../account/overview', color: 'white', icon: <ContactsIcon /> },
  { text: 'Theme', to: '/../account/theme', color: 'white' },
];

const AccountSidebar = () => {
  const drawerWidth = 300;
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar>
            <Typography variant="h6">
              baxter. account
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            {navigationLinks.map((link, index) => (
              <ListItem key={index} disablePadding component={Link} to={link.to}>
                <ListItemButton>
                  <ListItemText primary={link.text} style={{ color: link.color }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ flexGrow: 1 }} />
          <List>
            <ListItem>
              <ListItemButton onClick={handleLogout} color="inherit">
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
    </React.Fragment>
  );
};

export default AccountSidebar;

