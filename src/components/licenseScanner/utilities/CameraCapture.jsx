import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Camera } from 'react-camera-pro';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

const CameraCapture = ({ onCapture }) => {
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
        <DialogTitle>Camera Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()} color="primary">
            Reload
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', p: 1 }}>
      <Box sx={{ position: 'relative' }}>
        <Camera
          ref={cameraRef}
          aspectRatio={16 / 9}
          facingMode={facingMode}
          width="100%"
        />    
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" onClick={capture} sx={{ mr: 2 }} disabled={processing}>
          {processing ? 'Processing...' : 'Capture Photo'}
        </Button>
        <IconButton onClick={toggleFacingMode}>
          <FlipCameraAndroidIcon />
        </IconButton>
      </Box>
      {photo && (
        <Box sx={{ mt: 2 }}>
          <img src={photo} alt="Captured" style={{ width: '100%' }} />
          <Button variant="contained" onClick={() => setPhoto(null)} sx={{ mt: 2 }}>
            Retake Photo
          </Button>
        </Box>
      )}
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Photo captured successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CameraCapture;
