import React, { useRef, useState } from 'react';
import {
  Dialog,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CameraCapture from './CameraCapture';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

const CameraCaptureDialog = ({ cameraOpen, onClose, onCapture }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const cameraRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');

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
        <CameraCapture ref={cameraRef} onCapture={onCapture} facingMode={facingMode} />

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
          <IconButton onClick={() => cameraRef.current.takePhoto()} sx={{ color: 'white' }}>
            <CameraAltIcon sx={{ fontSize: 48 }} />
          </IconButton>
        </Box>

        <IconButton
          onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
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
    </Dialog>
  );
};

export default CameraCaptureDialog;
