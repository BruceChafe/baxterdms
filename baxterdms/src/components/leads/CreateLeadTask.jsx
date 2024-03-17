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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CreateLeadTask = ({ open, onClose, lead, id, onSaveSuccess }) => {
  const initialTaskState = {
    leadTaskType: "",
    leadTaskPriority: "",
    leadTaskEmployee: "",
    leadTaskSubject: "",
    leadTaskAdditionalInfo: "",
    followUpDate: null,
  };
  const [leadTask, setLeadTask] = useState(initialTaskState);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [taskTypeOptions, setTaskTypeOptions] = useState([]);
  const [taskPriorityOptions, setTaskPriorityOptions] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid =
      leadTask.leadTaskType &&
      leadTask.leadTaskPriority &&
      leadTask.followUpDate;
    setIsFormValid(isValid);
    fetchTaskConfigurations();
  }, [leadTask]);

  const fetchTaskConfigurations = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/configLeadTasks/1");
      const configData = await response.json();
      setTaskTypeOptions(configData.leadTaskTypeActive || []);
      setTaskPriorityOptions(configData.leadTaskPriorityActive || []);
    } catch (error) {
      console.error("Error fetching options:", error);
      setSnackbarMessage("Failed to load task configurations.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key, value) => {
    setLeadTask((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!isFormValid) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const leadNumber = lead.leadNumber; 

      const taskDetails = {
        followUpDate: leadTask.followUpDate.toISOString(), 
        type: leadTask.leadTaskType,
        priority: leadTask.leadTaskPriority,
        employee: leadTask.leadTaskEmployee,
        subject: leadTask.leadTaskSubject,
        additionalInfo: leadTask.leadTaskAdditionalInfo,
        timestamp: timestamp,
        status: "Active",
        activity: "Task Created",
        leadNumber: leadNumber,
      };

      await fetch(`http://localhost:8000/tasks`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskDetails), 
      });
      setLeadTask(initialTaskState);
      setSnackbarMessage("Task saved successfully!");
      onSaveSuccess(); 
    } catch (error) {
      setSnackbarMessage("Error saving lead task.");
      console.error("Error saving task:", error); 
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>
        Create Follow-Up{" "}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
        />{" "}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} disabled={loading || !isFormValid}>
          {loading ? <CircularProgress size={24} /> : "Save changes"}
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
