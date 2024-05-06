import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CloseIcon from "@mui/icons-material/Close";
import {
  addDoc,
  collection,
  Timestamp as FirestoreTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useFetchLeadTaskConfig } from "../../../hooks/FetchLeadTaskConfig";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useSnackbar } from "../../context/SnackbarContext";

const CreateLeadTask = ({ open, onClose, leadId, onSaveSuccess }) => {
  const {
    leadTaskTypeOptions,
    leadTaskPriorityOptions,
    leadTaskStatusOptions,
    loading,
    error,
  } = useFetchLeadTaskConfig();

  const { showSnackbar } = useSnackbar(); // Use the snackbar context

  const [newTask, setNewTask] = useState({
    leadTaskType: "",
    leadTaskEmployee: "",
    leadTaskStatus: "",
    leadTaskSubject: "",
    leadTaskFollowUpDate: "",
    leadTaskAdditionalInfo: "",
  });

  const handleChange = (e, field) => {
    setNewTask((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (date) => {
    setNewTask((prev) => ({
      ...prev,
      leadTaskFollowUpDate: date || new Date(),
    }));
  };

  const handleCreate = async () => {
    try {
      const now = FirestoreTimestamp.now();
      const followUpDate = FirestoreTimestamp.fromDate(
        newTask.leadTaskFollowUpDate || new Date()
      );
      const taskData = {
        ...newTask,
        leadId,
        leadTaskCreatedTimestamp: now,
        leadTaskFollowUpDate: followUpDate,
      };
      const taskRef = collection(db, "leadTasks");
      await addDoc(taskRef, taskData);
      onSaveSuccess();
      onClose();
      showSnackbar("Task created successfully.", "success");
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbar(`Error creating task: ${error.message}`, "error");
    }
  };

  if (loading) return <Box>Loading configuration...</Box>;
  if (error) {
    showSnackbar(`Error loading configuration: ${error.message}`, "error");
    return <Box>Error loading configuration: {error.message}</Box>;
  }

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{ "& .MuiDialog-paper": { width: "600px", maxWidth: "100%" } }}
    >
      <DialogTitle id="task-dialog-title">
        Create New Task
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Follow Up Date"
            value={newTask.leadTaskFollowUpDate}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="dense" />
            )}
          />
        </LocalizationProvider>
        {Object.entries({
          leadTaskType: leadTaskTypeOptions || [],
          leadTaskStatus: leadTaskStatusOptions || [],
        }).map(([field, options]) => (
          <TextField
            key={field}
            margin="dense"
            label={field.replace("leadTask", "")}
            value={newTask[field] || ""}
            onChange={(e) => handleChange(e, field)}
            fullWidth
            select
          >
            {options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        ))}
        <TextField
          margin="dense"
          label="Employee"
          value={newTask.leadTaskEmployee}
          onChange={(e) => handleChange(e, "leadTaskEmployee")}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Subject"
          value={newTask.leadTaskSubject}
          onChange={(e) => handleChange(e, "leadTaskSubject")}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Additional Info"
          value={newTask.leadTaskAdditionalInfo}
          onChange={(e) => handleChange(e, "leadTaskAdditionalInfo")}
          fullWidth
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeadTask;
