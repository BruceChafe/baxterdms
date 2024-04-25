import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore"; // Import Timestamp
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

const CreateLeadTask = ({ open, onClose, lead, leadId, onSaveSuccess }) => {
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
  }, [leadTask]);

  const handleFieldChange = (key, value) => {
    setLeadTask((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!lead || !lead.leadId) {
      setSnackbarMessage("Error: Lead number is undefined.");
      setSnackbarOpen(true);
      return;
    }
    if (!isFormValid) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    const taskDetails = {
      ...leadTask,
      followUpDate: Timestamp.fromDate(new Date(leadTask.followUpDate)), // Convert to Firestore Timestamp
      status: "Active",
      activity: "Task Created",
      leadId: lead.leadId,
      timestamp: Timestamp.now(), // Use Firestore Timestamp for current time
    };
    try {
      await setDoc(doc(db, "leadTasks", `${lead.leadId}`), taskDetails);
      setLeadTask(initialTaskState);
      setSnackbarMessage("Task saved successfully!");
      onSaveSuccess();
    } catch (error) {
      setSnackbarMessage(
        `Error saving lead task: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
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
          children={taskTypeOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        />
        <TextField
          variant="outlined"
          label="Follow-Up Priority"
          value={leadTask.leadTaskPriority}
          onChange={(e) =>
            handleFieldChange("leadTaskPriority", e.target.value)
          }
          select
          fullWidth
          children={taskPriorityOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        />
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
