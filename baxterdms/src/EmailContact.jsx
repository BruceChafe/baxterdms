import { Paper, IconButton, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

function EmailContact({ contact, showPanel, onClose }) {

    const outlook_smtp_config = {
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: 'your_outlook_email@example.com',
            pass: 'your_outlook_password',
        },
    };
    
    const [contactEmail, setContactEmail] = contact.emailAddress

    const handleSubmit = (e) => {
        console.log('contactEmail:', contactEmail);
        e.preventDefault();
    }

    const mailOptions = {
        from: 'your_outlook_email@example.com',
        to: contactEmail,
        subject: 'Your Subject',
        text: 'Your email body goes here.',
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
                            label="to:"
                            defaultValue={contact.emailAddress}
                        />
                        <br />
                        <TextField
                            id="outlined-disabled"
                            label="from:"
                        />
                        <br />
                        <TextField
                            id="outlined-disabled"
                            label="ccc:"
                        />
                        <br />
                        <TextField
                            id="outlined-disabled"
                            label="bcc:"
                        />
                        <br />
                        <TextField
                            id="outlined-disabled"
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
                </Paper>
            )}
        </>
    );
}

export default EmailContact;