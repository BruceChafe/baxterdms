import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Button, Paper, Typography, Divider, CircularProgress, Alert } from "@mui/material";
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
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const field = label.replace(" Management", "").replaceAll(" ", "");
    const docRef = doc(db, 'leadConfig', 'configData');
    const dataToSend = {
      [`${field}Unactive`]: unactiveData,
      [`${field}Active`]: activeData,
    };

    try {
      await updateDoc(docRef, dataToSend);
      setSaveStatus("success");
      console.log("Update successful for:", field);
    } catch (error) {
      console.error("Error updating configuration for:", field, error);
      setSaveStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>{label}</Typography>
        <TransferList
          leftItems={unactiveData || []}
          rightItems={activeData || []}
          setLeftItems={setUnactiveData}
          setRightItems={setActiveData}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Save Changes"}
        </Button>
        {saveStatus && (
          <Alert
            severity={saveStatus === "success" ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {saveStatus === "success"
              ? "Changes saved successfully."
              : "Failed to save changes. Please try again."}
          </Alert>
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
  const [leadDealershipUnactive, setLeadDealershipUnactive] = useState([]); 
  const [leadDealershipActive, setLeadDealershipActive] = useState([]);
  const [leadSalesConsultantUnactive, setLeadSalesConsultantUnactive] = useState([]);
  const [leadSalesConsultantActive, setLeadSalesConsultantActive] = useState([]);
  const [leadStatusUnactive, setLeadStatusUnactive] = useState([]);
  const [leadStatusActive, setLeadStatusActive] = useState([]);

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
      label: "Lead Sales Consultant Management",
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
    const fetchData = async () => {
      const docRef = doc(db, 'leadConfig', 'configData');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          console.log("Fetched data:", fetchedData);
          // Set each piece of state based on fetched data
          setLeadSourceUnactive(fetchedData.leadSourceUnactive || []);
          setLeadSourceActive(fetchedData.leadSourceActive || []);
          setLeadTypeUnactive(fetchedData.leadTypeUnactive || []);
          setLeadTypeActive(fetchedData.leadTypeActive || []);
          setLeadDealershipUnactive(fetchedData.leadDealershipUnactive || []);
          setLeadDealershipActive(fetchedData.leadDealershipActive || []);
          setLeadSalesConsultantUnactive(fetchedData.leadSalesConsultantUnactive || []);
          setLeadSalesConsultantActive(fetchedData.leadSalesConsultantActive || []);
          setLeadStatusUnactive(fetchedData.leadStatusUnactive || []);
          setLeadStatusActive(fetchedData.leadStatusActive || []);
        } else {
          console.log("No such document in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching configuration from Firestore:", error);
      }
    };

    fetchData();
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
