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
  const [selectedTask, setSelectedTask] = useState(taskDetails ? { ...taskDetails } : {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedTask(taskDetails ? { ...taskDetails } : {});
  }, [taskDetails]);

  const handleChange = (e, field) => {
    setSelectedTask((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (newValue) => {
    setSelectedTask((prev) => ({ ...prev, followUpDate: newValue }));
  };
  

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        ...selectedTask,
        followUpDate: selectedTask.followUpDate.toISOString(),
      };

      const response = await fetch(`http://localhost:8000/tasks/${selectedTask.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const updatedTask = await response.json();
      console.log("Task updated:", updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
      onClose(true);
    }
  };

  return (
    <Dialog
      onClose={() => onClose(false)}
      open={open}
      aria-labelledby="task-dialog-title"
      sx={{ "& .MuiDialog-paper": { width: "600px", maxWidth: "100%" } }}
    >
      <DialogTitle id="task-dialog-title">
        Task Details
        <IconButton
          aria-label="close"
          onClick={() => onClose(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
            label="Follow-Up Date"
            value={selectedTask.followUpDate}
            onChange={(date) => handleDateChange("followUpDate", date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        <TextField
          margin="dense"
          label="Task Type"
          value={selectedTask.type || ""}
          onChange={(e) => handleChange(e, "type")}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Employee"
          value={selectedTask.employee || ""}
          fullWidth
          onChange={(e) => handleChange(e, "employee")}
        />
        <TextField
          margin="dense"
          label="Status"
          value={selectedTask.status || ""}
          onChange={(e) => handleChange(e, "status")}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Subject"
          value={selectedTask.subject || ""}
          fullWidth
          onChange={(e) => handleChange(e, "subject")}
        />
        <TextField
          margin="dense"
          label="Additional Info"
          value={selectedTask.additionalInfo || ""}
          fullWidth
          onChange={(e) => handleChange(e, "additionalInfo")}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
