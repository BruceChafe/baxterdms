import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Button,
  IconButton,
  Box,
  Snackbar,
  Alert,
  Typography,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CameraComponent from './CameraComponent';
import { useMediaQuery } from '@mui/material';

const CameraCaptureDialog = ({ cameraOpen, onClose, onCapture }) => {
  const [facingMode, setFacingMode] = useState('environment');
  const [flash, setFlash] = useState(false);
  const [success, setSuccess] = useState(false);
  const cameraRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const capture = () => {
    if (cameraRef.current) {
      setFlash(true);
      const imageSrc = cameraRef.current.takePhoto();
      const rotatedImage = rotateImage(imageSrc, 90);
      onCapture(rotatedImage);
      setTimeout(() => {
        setSuccess(true);
        setFlash(false);
        onClose();
      }, 1000);
    }
  };

  const rotateImage = (src, degrees) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = src;

    return new Promise((resolve) => {
      image.onload = () => {
        canvas.width = image.height;
        canvas.height = image.width;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(image, -image.width / 2, -image.height / 2);
        resolve(canvas.toDataURL());
      };
    });
  };

  return (
    <Dialog
      open={cameraOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: 10,
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: isMobile ? '70vh' : '90vh',
          bgcolor: '#333',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            height: '10%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            pr: 2,
          }}
        >
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            height: '70%',
            position: 'relative',
          }}
        >
          <CameraComponent
            facingMode={facingMode}
            onLoading={setLoading}
            onError={setError}
          />
          {flash && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'white',
                opacity: 0.6,
                transition: 'opacity 0.2s',
              }}
            />
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            height: '20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <IconButton onClick={capture} sx={{ color: 'white', mb: 2 }}>
            <RadioButtonCheckedIcon sx={{ fontSize: 64 }} />
          </IconButton>
        </Box>
      </Box>

      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Photo captured successfully!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CameraCaptureDialog;
