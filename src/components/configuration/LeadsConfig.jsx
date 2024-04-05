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
      [`lead${field}Unactive`]: unactiveData,
      [`lead${field}Active`]: activeData,
    };

    fetch(`http://localhost:8000/configLeads/1/`, {
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
        onClick={() => handleSave(label.split(" ")[1])} // Pass the second word of the label
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

const LeadsConfig = () => {
  const [leadSourceUnactive, setLeadSourceUnactive] = useState([]);
  const [leadSourceActive, setLeadSourceActive] = useState([]);
  const [leadTypeUnactive, setLeadTypeUnactive] = useState([]);
  const [leadTypeActive, setLeadTypeActive] = useState([]);
  const [leadDealershipUnactive, setLeadDealershipUnactive] = useState([]); // New state
  const [leadDealershipActive, setLeadDealershipActive] = useState([]); // New state
  const [leadSalesConsultantUnactive, setLeadSalesConsultantUnactive] =
    useState([]);
  const [leadSalesConsultantActive, setLeadSalesConsultantActive] = useState(
    []
  );
  const [leadStatusUnactive, setLeadStatusUnactive] = useState([]); // New state
  const [leadStatusActive, setLeadStatusActive] = useState([]); // New state

  const configFields = [
    {
      label: "Lead Source Management",
      unactiveData: leadSourceUnactive,
      activeData: leadSourceActive,
      setUnactiveData: setLeadSourceUnactive,
      setActiveData: setLeadSourceActive,
    },
    {
      label: "Lead Type Management",
      unactiveData: leadTypeUnactive,
      activeData: leadTypeActive,
      setUnactiveData: setLeadTypeUnactive,
      setActiveData: setLeadTypeActive,
    },
    {
      label: "Lead Dealership Management",
      unactiveData: leadDealershipUnactive,
      activeData: leadDealershipActive,
      setUnactiveData: setLeadDealershipUnactive,
      setActiveData: setLeadDealershipActive,
    },
    {
      label: "Lead SalesConsultant Management",
      unactiveData: leadSalesConsultantUnactive,
      activeData: leadSalesConsultantActive,
      setUnactiveData: setLeadSalesConsultantUnactive,
      setActiveData: setLeadSalesConsultantActive,
    },
    {
      label: "Lead Status Management",
      unactiveData: leadStatusUnactive,
      activeData: leadStatusActive,
      setUnactiveData: setLeadStatusUnactive,
      setActiveData: setLeadStatusActive,
    },
  ];

  useEffect(() => {
    fetch("http://localhost:8000/configLeads/1")
      .then((response) => response.json())
      .then((data) => {
        setLeadSourceUnactive(data.leadSourceUnactive || []);
        setLeadSourceActive(data.leadSourceActive || []);
        setLeadTypeUnactive(data.leadTypeUnactive || []);
        setLeadTypeActive(data.leadTypeActive || []);
        setLeadDealershipUnactive(data.leadDealershipUnactive || []); // Set new state
        setLeadDealershipActive(data.leadDealershipActive || []); // Set new state
        setLeadSalesConsultantUnactive(data.leadSalesConsultantUnactive || []); // Set new state
        setLeadSalesConsultantActive(data.leadSalesConsultantActive || []); // Set new state
        setLeadStatusUnactive(data.leadStatusUnactive || []); // Set new state
        setLeadStatusActive(data.leadStatusActive || []); // Set new state
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

export default LeadsConfig;
