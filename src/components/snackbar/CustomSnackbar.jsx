import React from "react";
import { Snackbar } from "@mui/material";

const CustomSnackbar = ({ open, message, handleClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    />
  );
};

export default CustomSnackbar;
