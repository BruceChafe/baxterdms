import React, { useState, useEffect } from "react";
import { Button, Paper, Typography, Divider } from "@mui/material";
import { Box } from "@mui/system";
import TransferList from "../transferList/TransferList";

const LeadsSection = ({
  label,
  unactiveData,
  activeData,
  setUnactiveData,
  setActiveData,
}) => {
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = (field) => {
    const dataToSend = {
      [`lead${field}TypeUnactive`]: unactiveData,
      [`lead${field}TypeActive`]: activeData,
    };

    fetch(`http://localhost:8000/configLeadTasks/1/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (response.ok) {
          setSaveStatus("success");
        } else {
          setSaveStatus("error");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Update successful:", data);
      })
      .catch((error) => {
        console.error("Error updating configuration:", error);
        setSaveStatus("error");
      });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h5" mb={2}>
        {label}
      </Typography>
      <TransferList
        leftItems={unactiveData}
        rightItems={activeData}
        setLeftItems={setUnactiveData}
        setRightItems={setActiveData}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleSave(label.split(" ")[1])}
        disabled={saveStatus === "pending"}
        sx={{ mt: 2 }}
      >
        {saveStatus === "pending" ? "Saving..." : "Save"}
      </Button>
      {saveStatus && (
        <Typography
          variant="body2"
          color={saveStatus === "success" ? "success.main" : "error.main"}
          sx={{ mt: 2 }}
        >
          {saveStatus === "success"
            ? "Changes saved successfully."
            : "Failed to save changes. Please try again."}
        </Typography>
      )}
      </Paper>
    </Box>
  );
};

const LeadTaskConfig = () => {
  const [leadTaskTypeUnactive, setLeadTaskTypeUnactive] = useState([]);
  const [leadTaskTypeActive, setLeadTaskTypeActive] = useState([]);
  const [leadTaskStatusUnactive, setLeadTaskStatusUnactive] = useState([]);
  const [leadTaskStatusActive, setLeadTaskStatusActive] = useState([]);
  const [leadTaskPriorityUnactive, setLeadTaskPriorityUnactive] = useState([]); 
  const [leadTaskPriorityActive, setLeadTaskPriorityActive] = useState([]);

  const configFields = [
    {
      label: "Lead Task Type Management",
      unactiveData: leadTaskTypeUnactive,
      activeData: leadTaskTypeActive,
      setUnactiveData: setLeadTaskTypeUnactive,
      setActiveData: setLeadTaskTypeActive,
    },
    {
      label: "Lead Task Status Management",
      unactiveData: leadTaskStatusUnactive,
      activeData: leadTaskStatusActive,
      setUnactiveData: setLeadTaskStatusUnactive,
      setActiveData: setLeadTaskStatusActive,
    },
    {
      label: "Lead Task Priority Management",
      unactiveData: leadTaskPriorityUnactive,
      activeData: leadTaskPriorityActive,
      setUnactiveData: setLeadTaskPriorityUnactive,
      setActiveData: setLeadTaskPriorityActive,
    },
  ];

  useEffect(() => {
    fetch("http://localhost:8000/configLeadTasks/1/")
      .then((response) => response.json())
      .then((data) => {
        setLeadTaskTypeUnactive(data.leadTaskTypeUnactive || []);
        setLeadTaskTypeActive(data.leadTaskTypeActive || []);
        setLeadTaskStatusUnactive(data.leadTaskStatusUnactive || []);
        setLeadTaskStatusActive(data.leadTaskStatusActive || []);
        setLeadTaskPriorityUnactive(data.leadTaskPriorityUnactive || []); 
        setLeadTaskPriorityActive(data.leadTaskPriorityActive || []); 
      })
      .catch((error) => {
        console.error("Error fetching configuration:", error);
      });
  }, []);

  return (
    <>
      {configFields.map((configField, index) => (
        <Box key={index}>
          <LeadsSection {...configField} />
          <Divider sx={{ mt: 2, mb: 2 }} />
        </Box>
      ))}
    </>
  );
};

export default LeadTaskConfig;
