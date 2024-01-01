// import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

// function SidebarMenu() {
//   return (
//     <Sidebar>
//           <div style={{ height: '100vh', flex: 1 }}>
//              <h1><center>baxter</center></h1>
//             <Menu>
//               <SubMenu label="Contacts">
//                 <MenuItem component={<Link to="/newcontact" />}>New Contact</MenuItem>
//                 <MenuItem component={<Link to="/contacts" />}>Contacts</MenuItem>
//               </SubMenu>
//               <SubMenu label="Maps">
//                 <MenuItem> Google maps</MenuItem>
//                 <MenuItem> Open street maps</MenuItem>
//               </SubMenu>
//               <SubMenu label="Theme">
//                 <MenuItem> Dark</MenuItem>
//                 <MenuItem> Light</MenuItem>
//               </SubMenu>
//               <SubMenu label="Components">
//                 <MenuItem> Grid</MenuItem>
//                 <MenuItem> Layout</MenuItem>
//                 <SubMenu label="Forms">
//                   <MenuItem> Input</MenuItem>
//                   <MenuItem> Select</MenuItem>
//                   <SubMenu label="More">
//                     <MenuItem> CheckBox</MenuItem>
//                     <MenuItem> Radio</MenuItem>
//                   </SubMenu>
//                 </SubMenu>
//               </SubMenu>
//               <SubMenu label="E-commerce">
//                 <MenuItem> Product</MenuItem>
//                 <MenuItem> Orders</MenuItem>
//                 <MenuItem> Credit card</MenuItem>
//               </SubMenu>
//             </Menu>
//           </div>
//     </Sidebar>
//   );
// };

// export default SidebarMenu;
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Paper, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Backdrop } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailContact from './EmailContact';

export default function SidebarMenu() {
  const drawerWidth = 300;

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
        </Drawer>
      </Box>
    </div>
  );
}
