import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [stream, setStream] = useState(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const getUserMedia = async () => {
      const constraints = {
        video: { facingMode, zoom }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    };

    if (videoRef.current && !stream) {
      getUserMedia();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, zoom, stream]);

  const handleCapture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL('image/jpeg');
    onCapture(imageSrc);
  };

  const handleToggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleZoom = (event) => {
    if (event.deltaY < 0) {
      setZoom(prevZoom => Math.min(prevZoom + 0.1, 3)); // Max zoom level of 3
    } else {
      setZoom(prevZoom => Math.max(prevZoom - 0.1, 1)); // Min zoom level of 1
    }
  };

  const handleTapToFocus = (event) => {
    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = videoTrack.getCapabilities();
    const focusX = (event.clientX / videoRef.current.clientWidth) * capabilities.focusMode.max;
    const focusY = (event.clientY / videoRef.current.clientHeight) * capabilities.focusMode.max;

    videoTrack.applyConstraints({
      advanced: [{ focusMode: 'single-shot', focusDistance: { x: focusX, y: focusY } }]
    });
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box 
        component="video" 
        ref={videoRef} 
        autoPlay 
        onWheel={handleZoom} 
        onClick={handleTapToFocus}
        sx={{ width: '100%', height: 'auto', maxWidth: 320, maxHeight: 240 }}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleCapture} sx={{ mr: 2 }}>
          Capture Photo
        </Button>
        <IconButton onClick={handleToggleFacingMode}>
          <FlipCameraAndroidIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CameraCapture;
