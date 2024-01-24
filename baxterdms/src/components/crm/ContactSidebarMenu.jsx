import React, { useState } from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Paper, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Backdrop } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailContact from './EmailContact';

const ContactSidebarMenu = ({ contact }) => {
    const drawerWidth = 300;
    const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(null);

    const handleEmailClick = () => {
        setIsEmailPaperOpen(true);
    };

    const handleCloseEmailPaper = () => {
        setIsEmailPaperOpen(null);
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
                                        <Typography variant="body2">{contact.email || 'null'}</Typography>
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
                                        <Typography variant="body2">{contact.phoneNumbers?.mobilePhone || 'null'}</Typography>
                                    </div>
                                </ListItemText>
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
                                    <ListItemText primary={text} variant="body2"/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                {isEmailPaperOpen && (
                    <>
                        <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isEmailPaperOpen} onClick={handleCloseEmailPaper} />
                        <EmailContact contact={contact} showPanel onClose={handleCloseEmailPaper} />
                    </>
                )}
            </Box>
        </div>
    );
}

export default ContactSidebarMenu;
