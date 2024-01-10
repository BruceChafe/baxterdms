// SidebarMenu Component
// This component provides a sidebar menu for navigation

// Import necessary components and libraries
import React from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';

// Array of objects representing navigation links
const navigationLinks = [
  { text: 'New Contact', to: '/newcontact', color: 'white' },
  { text: 'Contacts', to: '/contacts', color: 'white' },
  // Add more objects as needed
];

export default function SidebarMenu() {
  // Define the width of the drawer
  const drawerWidth = 300;

  // Hook for navigation in React Router
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Sign out the user using the Firebase auth object
      await auth.signOut();

      // Redirect to the sign-in page after successful logout
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // JSX for rendering the SidebarMenu
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Drawer component for the sidebar */}
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
          {/* Toolbar for the top section of the sidebar */}
          <Toolbar>
            <Typography variant="h6">
              baxter.
            </Typography>
          </Toolbar>

          {/* Divider for visual separation */}
          <Divider />

          {/* List for the main navigation links */}
          <List>
            {/* Map through the array and generate ListItems with Link components */}
            {navigationLinks.map((link, index) => (
              <ListItem key={index} disablePadding component={Link} to={link.to}>
                <ListItemButton>
                  {/* Use the properties from the array object to customize the ListItemText */}
                  <ListItemText primary={link.text} style={{ color: link.color }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Divider for visual separation */}
          <Divider />

          {/* List for additional placeholder links (can be customized) */}
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Divider for visual separation */}
          <Divider />

          {/* List for log out button */}
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
}