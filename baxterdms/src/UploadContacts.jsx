import { Paper, IconButton, Box, TextField, Button, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

function UploadContacts({ showPanel}) {
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
                    width: '90%',
                    height: '90vh',
                    zIndex: 9999,
                }}
            >
                {/* Content of the component */}
            </Paper>
            )}
        </>
    );
}

export default UploadContacts;