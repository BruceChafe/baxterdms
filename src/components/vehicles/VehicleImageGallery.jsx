import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const VehicleImageGallery = ({ photos }) => {
  console.log("Photos array:", photos);  // Add this to verify the array content
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const handlePrev = () =>
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  const handleNext = () =>
    setActiveImageIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "auto",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleOpenDialog}
      >
        <img
          src={
            photos.length > 0
              ? photos[activeImageIndex]
              : "path/to/default/image.jpg"  // Check this default path
          }
          alt={`Vehicle Image ${activeImageIndex + 1}`}
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <IconButton onClick={handlePrev}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography>{`${activeImageIndex + 1} of ${photos.length}`}</Typography>
        <IconButton onClick={handleNext}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        aria-labelledby="image-view-dialog"
      >
        <DialogContent>
          <img
            src={photos[activeImageIndex]}
            alt={`Vehicle Image ${activeImageIndex + 1}`}
            style={{
              width: "100%",
              maxHeight: "75vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};


export default VehicleImageGallery;
