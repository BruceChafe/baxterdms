import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Button, TextField, Box, Modal, styled } from '@mui/material';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully!');
      handleOpen();
    } catch (error) {
      console.error('Error sending password reset email:', error.message);
    }
  };

  const ModalContent = styled(Box)`
    position: absolute;
    width: 100%;
    background-color: #000;
    border: 2px solid #000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    p: {
      margin: 0;
      padding: 10px;
    }
  `;

  return (
    <Box component="form" noValidate sx={{ mt: 1 }} style={{ width: '80%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        onClick={handleResetPassword}
      >        Reset Password
      </Button>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
      >
        <ModalContent sx={{ width: 400 }}>
          <IconButton
            aria-label="close"
            style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}
            onClose={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <h2 id="unstyled-modal-title" className="modal-title">
            Text in a modal
          </h2>
          <p id="unstyled-modal-description" className="modal-description">
            Aliquid amet deserunt earum!
          </p>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ForgotPassword;