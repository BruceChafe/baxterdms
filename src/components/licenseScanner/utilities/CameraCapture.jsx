import React, { useRef, useCallback, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import Webcam from 'react-webcam';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment'); // Default to back camera

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode }}
        width={320}
        height={240}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={capture} sx={{ mr: 2 }}>
          Capture Photo
        </Button>
        <IconButton onClick={toggleFacingMode}>
          <FlipCameraAndroidIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CameraCapture;
