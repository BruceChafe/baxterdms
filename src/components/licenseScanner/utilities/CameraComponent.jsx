import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Camera } from 'react-camera-pro';

const CameraComponent = forwardRef(({ facingMode, onLoading, onError }, ref) => {
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    takePhoto: () => {
      return cameraRef.current.takePhoto();
    }
  }));

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const constraints = { video: { facingMode } };
        await navigator.mediaDevices.getUserMedia(constraints);
        setLoading(false);
        onLoading(false);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setError('Camera not found. Please ensure your camera is connected and try again.');
        onError(error);
        setLoading(false);
        onLoading(false);
      }
    };

    getUserMedia();
  }, [facingMode, onLoading, onError]);

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

  if (error) {
    return (
      <Dialog open={Boolean(error)} onClose={() => setError(null)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle sx={{ flex: 1 }}>Capture Driver's License</DialogTitle>
          <IconButton onClick={() => setError(null)}>
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
    <Camera
      ref={cameraRef}
      aspectRatio={9 / 16}
      facingMode={facingMode}
      width="100%"
      height="100%"
    />
  );
});

export default CameraComponent;
