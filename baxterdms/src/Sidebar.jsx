import React from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

export default function SidebarMenu() {
  const drawerWidth = 300;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect to the sign-in page after successful logout
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div>
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
              baxter.
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem disablePadding component={Link} to="/newcontact">
              <ListItemButton>
                <ListItemText primary="New Contact" style={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding component={Link} to="/contacts">
              <ListItemButton>
                <ListItemText primary="Contacts" style={{ color: 'white' }} />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Add a Logout button */}
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
    </div>
  );
}
