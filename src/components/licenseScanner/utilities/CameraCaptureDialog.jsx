import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { Camera } from 'react-camera-pro';

const CameraCaptureDialog = ({ cameraOpen, onClose, onCapture }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const cameraRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [cameraError, setCameraError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [flash, setFlash] = useState(false);

  const capture = () => {
    if (cameraRef.current) {
      setFlash(true);
      const imageSrc = cameraRef.current.takePhoto();
      setPhoto(imageSrc);
      onCapture(imageSrc);
      setProcessing(true);
      setTimeout(() => {
        setSuccess(true);
        setProcessing(false);
        setFlash(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const constraints = { video: { facingMode } };
        await navigator.mediaDevices.getUserMedia(constraints);
        setLoading(false);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError('Camera not found. Please ensure your camera is connected and try again.');
        setCameraError(true);
        setLoading(false);
      }
    };

    getUserMedia();
  }, [facingMode]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking camera access...
        </Typography>
      </Box>
    );
  }

  if (cameraError) {
    return (
      <Dialog open={cameraError} onClose={() => setCameraError(false)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle sx={{ flex: 1 }}>Capture Driver's License</DialogTitle>
          <IconButton onClick={() => setCameraError(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()} color="primary" variant="outlined">
            Reload
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

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
          height: isSmallScreen ? '90vh' : '100vh',
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

        <Box
          sx={{
            height: '70%',
            position: 'relative',
          }}
        >
          <Camera
            ref={cameraRef}
            aspectRatio={9 / 16}
            facingMode={facingMode}
            width="100%"
            height="100%"
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
