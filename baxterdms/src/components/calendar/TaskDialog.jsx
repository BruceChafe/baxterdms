import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  TextField
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TaskDialog = ({ open, onClose, taskDetails }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Task Details
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {taskDetails && (
          // <TextField variant="outlined" label="Task Date" value={taskDetails.followUpDate}/>
          <DialogContentText>
            Task Type: {taskDetails.type}
            <br />
            Task Subject: {taskDetails.additionalInfo}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
