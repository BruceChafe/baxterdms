import { Paper, IconButton, Box, TextField, Button, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

function EmailContact({ contact, showPanel, onClose }) {
    const [contactEmail, setContactEmail] = useState(contact.emailAddress);
    const [from, setFrom] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const apiUrl = 'http://localhost:3001/send-email';

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const [panelVisible, setPanelVisible] = useState(showPanel);

    const handleClosePanel = () => {
        setPanelVisible(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: contactEmail,
                    from,
                    subject,
                    body,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSnackbarMessage('Email sent successfully!');
            } else {
                setSnackbarMessage(`Error: ${data.error}`);
            }
            setSnackbarOpen(true);
            setPanelVisible(false);
        } catch (error) {
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarOpen(true);
        }
    };

    return (
        <>
            {showPanel && (
                <Paper
                    elevation={3}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        width: '75%',
                        height: '95vh',
                        zIndex: 9999,
                    }}
                >
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '90%' },
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        {/* Close button */}
                        <IconButton
                            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}
                            onClick={onClose}
                        >
                            <CloseIcon />
                        </IconButton>

                        <TextField
                            onChange={(e) => setContactEmail(e.target.value)}
                            id="to"
                            label="to:"
                            defaultValue={contact.emailAddress}
                        />
                        <br />
                        <TextField
                            onChange={(e) => setFrom(e.target.value)}
                            id="from"
                            label="from:"
                        />
                        <br />
                        <TextField
                            onChange={(e) => setSubject(e.target.value)}
                            id="subject"
                            label="subject:"
                        />
                        <br />
                        <TextField
                            onChange={(e) => setBody(e.target.value)}
                            id="body"
                            label="body:"
                            multiline
                            rows={12}
                        />
                        <br />
                        <Button
                            type="submit"
                            color='secondary'
                            variant='outlined'
                        >
                            Submit
                        </Button>

                    </Box>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => {
                            handleSnackbarClose();
                            handleClosePanel();
                        }}
                        message={snackbarMessage}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    />
                </Paper>
            )}
        </>
    );
}

export default EmailContact;