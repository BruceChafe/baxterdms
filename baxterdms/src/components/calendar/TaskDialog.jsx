import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TaskDialog = ({ open, onClose, taskDetails }) => {
  const [selectedTask, setSelectedTask] = useState({ ...taskDetails });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedTask({ ...taskDetails });
  }, [taskDetails]);

  const handleChange = (e, field) => {
    setEditedTask((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // const handleSave = () => {
  //   setLoading(true);
  //   try {
  //     // const updatedTask = {

  //   }
  // };

  return (
    <Dialog
      onClose={() => onClose(false)}
      open={open}
      sx={{ "& .MuiDialog-paper": { width: "600px", maxWidth: "100%" } }}
    >
      <DialogTitle>
        Task Details
        <IconButton
          onClick={() => onClose(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {selectedTask && (
          <Box>
            <TextField
              variant="outlined"
              label="Task Date"
              value={selectedTask.followUpDate || ""}
              onChange={(e) => handleChange(e, "followUpDate")}
              fullWidth
            />
            <TextField
              variant="outlined"
              label="Task Type"
              value={selectedTask.type || ""}
              onChange={(e) => handleChange(e, "type")}
              fullWidth
            />
            {/* <Box>
              <TextField
                variant="outlined"
                label="Task Type"
                value={selectedTask.type || ""}
                onChange={(e) => handleChange(e, "type")}
                fullWidth
              />
              <TextField
                variant="outlined"
                label="Task Type"
                value={taskDetails.type}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                variant="outlined"
                label="Employee"
                value={taskDetails.employee}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                variant="outlined"
                label="Status"
                value={taskDetails.status}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                variant="outlined"
                label="Subject:"
                value={taskDetails.subject}
                fullWidth
              />
            </Box>
            <Box>
              <TextField
                variant="outlined"
                label="Additional Info:"
                value={taskDetails.additionalInfo}
                fullWidth
              />
            </Box> */}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        {/* <Button onClick={handleSave}>Save</Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
