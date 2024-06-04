import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Box, Button } from '@mui/material';

const CameraCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <Box sx={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: '100%', maxWidth: 640, height: 'auto' }}
      />
      <Button variant="contained" color="primary" onClick={capture} sx={{ mt: 2 }}>
        Capture Photo
      </Button>
    </Box>
  );
};

export default CameraCapture;
