import { Paper, IconButton, Box, Tab, Typography, Grid, TextField, MenuItem, Divider, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import ContactRecentActivity from './ContactRecentActivity';
import ContactSidebarMenu from './ContactSidebarMenu';

function Contact({ contact, showPanel, onClose }) {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!contact) {
        return null;
    }

    return (
        <>
            {/* Contact Panel */}
            {showPanel && (
                <Paper
                    elevation={3}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        width: '90%',
                        height: '90vh',
                        zIndex: 9999,
                    }}
                >
                    {/* Close button */}
                    <IconButton
                        aria-label="close"
                        style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}
                        onClick={onClose}

                    >
                        <CloseIcon />
                    </IconButton>

                    <Grid container>
                        <Grid>
                            <ContactSidebarMenu contact={contact} />
                        </Grid>
                        <Grid>
                            <Box sx={{ width: '100%' }}>
                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '75%' }}>
                                        <TabList onChange={handleChange}>
                                            <Tab label="Recent Activity" value="1" />
                                            <Tab label="Item Two" value="2" />
                                            <Tab label="Item Three" value="3" />
                                        </TabList>
                                    </Box>

                                    <TabPanel value="1"><ContactRecentActivity /></TabPanel>
                                    <TabPanel value="2"><Typography>
                                        
                                    </Typography></TabPanel>
                                    <TabPanel value="3">Item Three</TabPanel>

                                </TabContext>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </>
    );
}

export default Contact;