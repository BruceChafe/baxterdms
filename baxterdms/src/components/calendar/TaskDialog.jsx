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
    setSelectedTask((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/leads/${selectedTask.leadId}/tasks/${selectedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      console.log('Task updated:', updatedTask);
      setLoading(false);
      onClose(true);
    } catch (error) {
      console.error('Error updating task:', error);
      setLoading(false);
    }
  };

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
              value={selectedTask.id || ""}
              onChange={(e) => handleChange(e, "type")}
              fullWidth
            />
            
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
                value={selectedTask.type}
                fullWidth
              />

              <TextField
                variant="outlined"
                label="Employee"
                value={selectedTask.employee}
                fullWidth
              />

              <TextField
                variant="outlined"
                label="Status"
                value={selectedTask.status}
                fullWidth
              />

              <TextField
                variant="outlined"
                label="Subject:"
                value={selectedTask.subject}
                fullWidth
              />

              <TextField
                variant="outlined"
                label="Additional Info:"
                value={selectedTask.additionalInfo}
                fullWidth
              />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
