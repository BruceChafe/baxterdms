import React, { useState, useEffect } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFetchLeadTaskConfig } from "../../../hooks/FetchLeadTaskConfig";

const TaskDialog = ({ open, onClose, taskDetails, refetchTasks }) => {
  const {
    leadTaskTypeOptions,
    leadTaskPriorityOptions,
    leadTaskStatusOptions,
    loading,
    error,
  } = useFetchLeadTaskConfig();

  const [selectedTask, setSelectedTask] = useState(
    taskDetails ? { ...taskDetails } : {}
  );
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    setSelectedTask(taskDetails ? { ...taskDetails } : {});
  }, [taskDetails]);

  const handleChange = (e, field) => {
    setSelectedTask((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setLoadingSave(true);
    const taskRef = doc(db, "leadTasks", selectedTask.id);
    const updatedFields = {
      leadTaskType: selectedTask.leadTaskType,
      leadTaskEmployee: selectedTask.leadTaskEmployee,
      leadTaskStatus: selectedTask.leadTaskStatus,
      leadTaskSubject: selectedTask.leadTaskSubject,
      leadTaskFollowUpDate: selectedTask.leadTaskFollowUpDate,
      leadTaskAdditionalInfo: selectedTask.leadTaskAdditionalInfo,
    };

    try {
      await updateDoc(taskRef, updatedFields);
      refetchTasks();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) return <Box>Loading configuration...</Box>;
  if (error) return <Box>Error loading configuration: {error}</Box>;

  return (
    <Dialog
      onClose={() => onClose()}
      open={open}
      sx={{ "& .MuiDialog-paper": { width: "600px", maxWidth: "100%" } }}
    >
      <DialogTitle id="task-dialog-title">
        Task Details
        <IconButton
          onClick={() => onClose()}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {Object.entries({
          leadTaskType: leadTaskTypeOptions || [],
          leadTaskStatus: leadTaskStatusOptions || [],
          leadTaskEmployee: [],
          leadTaskSubject: [],
          leadTaskAdditionalInfo: [],
        }).map(([field, options]) => (
          <TextField
            key={field}
            margin="dense"
            label={field.replace("leadTask", "")}
            value={selectedTask[field] || ""}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="outlined" disabled={loadingSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
