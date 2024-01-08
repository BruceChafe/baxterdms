// Import necessary components and icons from Material-UI
import React, { useState } from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Paper, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Backdrop } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailContact from './EmailContact';

// Functional component for the ContactSidebarMenu
export default function ContactSidebarMenu({ contact }) {
    // Set the width of the drawer
    const drawerWidth = 300;

    // State variable to manage the visibility of the EmailContact panel
    const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(null);

    // Function to handle the opening of the EmailContact panel
    const handleEmailClick = () => {
        setIsEmailPaperOpen(true);
    };

    // Function to handle the closing of the EmailContact panel
    const handleCloseEmailPaper = () => {
        setIsEmailPaperOpen(null);
    };

    // JSX for rendering the ContactSidebarMenu
    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* Drawer for displaying contact information */}
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
                        {/* Display contact name in the AppBar */}
                        <Typography variant="h6">
                            {contact.firstName} {contact.lastName}
                        </Typography>
                    </Toolbar>
                    <Divider />
                    <List>
                        {/* Display email and mobile phone information */}
                        {[contact.email, contact.phoneNumbers.mobilePhone].map((text, index) => (
                            <ListItem key={text} disablePadding className="small-list-item">
                                <ListItemButton onClick={handleEmailClick}>
                                    <ListItemIcon>
                                        {/* Display icons based on index */}
                                        {index % 3 === 0 ? <EmailOutlinedIcon /> : (index % 3 === 1 ? <SmsOutlinedIcon /> : <LocalPhoneOutlinedIcon />)}
                                    </ListItemIcon>
                                    <ListItemText>
                                        {/* Display contact information */}
                                        <div>
                                            <Typography variant="body2" style={{ fontSize: '0.8rem' }}>{text}</Typography>
                                        </div>
                                    </ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>

                    <Divider />
                    <List>
                        {/* Placeholder list items */}
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

                {/* Render EmailContact panel if isEmailPaperOpen is true */}
                {isEmailPaperOpen && (
                    <>
                        {/* Backdrop for covering the main content when the EmailContact panel is open */}
                        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isEmailPaperOpen} onClick={handleCloseEmailPaper} />
                        {/* EmailContact panel */}
                        <EmailContact contact={contact} showPanel onClose={handleCloseEmailPaper} />
                    </>
                )}
            </Box>
        </div>
    );
}
