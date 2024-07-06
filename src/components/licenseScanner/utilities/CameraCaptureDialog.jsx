import React, { useRef, useState, useEffect } from 'react';
import {
  Dialog,
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
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';
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

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>Capture Driver's License</Typography>
          <IconButton onClick={() => setCameraError(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography>{error}</Typography>
          <IconButton onClick={() => window.location.reload()} color="primary">
            Reload
          </IconButton>
        </Box>
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
          height: isSmallScreen ? '80vh' : '100vh',
          bgcolor: 'black',
        }}
      >
        <Camera
          ref={cameraRef}
          aspectRatio={16 / 9}
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

        {/* Overlay for centering driver's license */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '40%',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '4px',
            pointerEvents: 'none',
          }}
        />

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            p: 1,
          }}
        >
          <IconButton onClick={capture} sx={{ color: 'white' }}>
            <CameraAltIcon sx={{ fontSize: 48 }} />
          </IconButton>
        </Box>

        <IconButton
          onClick={toggleFacingMode}
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <FlipCameraAndroidIcon />
        </IconButton>
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
