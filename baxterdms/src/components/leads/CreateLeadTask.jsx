import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CreateLeadTask = ({ open, onClose, lead, id }) => {
  const [leadTask, setLeadTask] = useState({
    leadTaskType: "",
    leadTaskEmployee: "",
    leadTaskSubject: "",
    leadTaskAdditionalInfo: "",
    followUpDate: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFieldChange = (key, value) => {
    setLeadTask({
      ...leadTask,
      [key]: value,
    });
  };

  const handleSave = async () => {
    try {
      const timestamp = new Date().toISOString();
      const updatedLead = {
        ...lead,
        tasks: [
          ...(lead.tasks || []),
          {
            followUpDate: leadTask.followUpDate,
            type: leadTask.leadTaskType,
            employee: leadTask.leadTaskEmployee,
            subject: leadTask.leadTaskSubject,
            additionalInfo: leadTask.leadTaskAdditionalInfo,
            timestamp: timestamp,
            status: "Active",
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
        leadTaskEmployee: "",
        leadTaskSubject: "",
        leadTaskAdditionalInfo: "",
        followUpDate: null,
      });
      setSnackbarMessage("Email sent successfully!");
      setSnackbarOpen(true);

      setTimeout(() => {
        onClose();
        setSnackbarOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving lead task:", error);
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);

      setTimeout(() => {
        onClose();
        setSnackbarOpen(false);
      }, 3000);
    }
  };

  return (
    <Dialog onClose={onClose} open={open}>
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
          fullWidth
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave}>Save changes</Button>
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
