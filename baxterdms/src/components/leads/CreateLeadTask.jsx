import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Snackbar,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CreateLeadTask = ({ open, onClose, lead, id, onSaveSuccess }) => {
  const [leadTask, setLeadTask] = useState({
    leadTaskType: "",
    leadTaskPriority: "",
    leadTaskEmployee: "",
    leadTaskSubject: "",
    leadTaskAdditionalInfo: "",
    followUpDate: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskTypeOptions, setTaskTypeOptions] = useState([]);
  const [taskPriorityOptions, setTaskPriorityOptions] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFieldChange = (key, value) => {
    setLeadTask({
      ...leadTask,
      [key]: value,
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/configLeadTasks/1")
      .then((response) => response.json())
      .then((configData) => {
        const taskTypeOptions = configData.leadTaskTypeActive || [];
        const taskPriorityOptions = configData.leadTaskPriorityActive || [];
        setTaskTypeOptions(taskTypeOptions);
        setTaskPriorityOptions(taskPriorityOptions);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
        setFetchError("Failed to fetch task options.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const updatedLead = {
        ...lead,
        tasks: [
          ...(lead.tasks || []),
          {
            followUpDate: leadTask.followUpDate,
            type: leadTask.leadTaskType,
            priority: leadTask.leadTaskPriority,
            employee: leadTask.leadTaskEmployee,
            subject: leadTask.leadTaskSubject,
            additionalInfo: leadTask.leadTaskAdditionalInfo,
            timestamp: timestamp,
            status: "Active",
            activity: "Task Created",
          },
        ],
      };
      await fetch(`http://localhost:8000/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      });
      setLeadTask({
        leadTaskType: "",
        leadTaskPriority: "",
        leadTaskEmployee: "",
        leadTaskSubject: "",
        leadTaskAdditionalInfo: "",
        followUpDate: null,
      });
      setSnackbarMessage("Task saved successfully!");
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
      }, 2000);
      onSaveSuccess();
    } catch (error) {
      console.error("Error saving lead task:", error);
      setSnackbarMessage("Error saving lead task.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{ "& .MuiDialog-paper": { width: "600px", maxWidth: "100%" } }}
    >
      <DialogTitle>
        Create Follow-Up
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <DatePicker
            label="Follow-Up Date"
            value={leadTask.followUpDate}
            onChange={(date) => handleFieldChange("followUpDate", date)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
        <TextField
          variant="outlined"
          label="Follow-Up Type"
          value={leadTask.leadTaskType}
          onChange={(e) => handleFieldChange("leadTaskType", e.target.value)}
          select
          fullWidth
        >
          {taskTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          label="Follow-Up Priority"
          value={leadTask.leadTaskPriority}
          onChange={(e) =>
            handleFieldChange("leadTaskPriority", e.target.value)
          }
          select
          fullWidth
        >
          {taskPriorityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          variant="outlined"
          label="Assigned Employee"
          value={leadTask.leadTaskEmployee}
          onChange={(e) =>
            handleFieldChange("leadTaskEmployee", e.target.value)
          }
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Subject"
          value={leadTask.leadTaskSubject}
          onChange={(e) => handleFieldChange("leadTaskSubject", e.target.value)}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Additional Info"
          value={leadTask.leadTaskAdditionalInfo}
          onChange={(e) =>
            handleFieldChange("leadTaskAdditionalInfo", e.target.value)
          }
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save changes"}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />
    </Dialog>
  );
};

export default CreateLeadTask;
