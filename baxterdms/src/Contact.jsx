// Import necessary components and icons from Material-UI
import { Paper, IconButton, Box, Tab, Typography, Grid, TextField, MenuItem, Divider, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';
import ContactRecentActivity from './ContactRecentActivity';
import ContactSidebarMenu from './ContactSidebarMenu';

// Functional component for displaying contact details and recent activities
function Contact({ contact, showPanel, onClose }) {
    // State for managing the active tab value
    const [value, setValue] = React.useState('1');

    // Function to handle tab change
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // If no contact is provided, render nothing
    if (!contact) {
        return null;
    }

    // JSX for rendering the Contact component
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

                    {/* Grid container for layout */}
                    <Grid container>
                        {/* Grid for sidebar menu */}
                        <Grid>
                            <ContactSidebarMenu contact={contact} />
                        </Grid>

                        {/* Grid for tab content */}
                        <Grid>
                            {/* Tab context for managing tabs */}
                            <Box sx={{ width: '100%' }}>
                                <TabContext value={value}>
                                    {/* TabList for switching between tabs */}
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '75%' }}>
                                        <TabList onChange={handleChange}>
                                            <Tab label="Recent Activity" value="1" />
                                            <Tab label="Item Two" value="2" />
                                            <Tab label="Item Three" value="3" />
                                        </TabList>
                                    </Box>

                                    {/* TabPanels for displaying content based on active tab */}
                                    <TabPanel value="1"><ContactRecentActivity /></TabPanel>
                                    <TabPanel value="2"><Typography>{/* Content for Tab Two */}</Typography></TabPanel>
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

// Export the Contact component as the default export
export default Contact;
