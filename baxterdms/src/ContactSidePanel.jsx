import React, { useState } from 'react';
import { Box, Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Paper, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Backdrop } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailContact from './EmailContact';

export default function ContactSidebarMenu({ contact }) {
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
                        {[contact.emailAddress, contact.phoneNumbers.mobilePhone, contact.phoneNumbers.mobilePhone].map((text, index) => (
                            <ListItem key={text} disablePadding className="small-list-item">
                                <ListItemButton onClick={handleEmailClick}>
                                    <ListItemIcon>
                                        {index % 3 === 0 ? <EmailOutlinedIcon /> : (index % 3 === 1 ? <SmsOutlinedIcon /> : <LocalPhoneOutlinedIcon />)}
                                    </ListItemIcon>
                                    <ListItemText>
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
