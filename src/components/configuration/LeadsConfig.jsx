import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Button,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import TransferList from "../transferList/TransferList";
import { useSnackbar } from "../../context/SnackbarContext";

const LeadsSection = ({
  label,
  name,
  unactiveData,
  activeData,
  setUnactiveData,
  setActiveData,
}) => {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSave = async () => {
    setLoading(true);
    const field = name;
    const docRef = doc(db, "leadConfig", "configData");
    const dataToSend = {
      [`${field}Unactive`]: unactiveData,
      [`${field}Active`]: activeData,
    };

    try {
      await updateDoc(docRef, dataToSend);
      showSnackbar("Update successful for " + field, "success");
    } catch (error) {
      showSnackbar(
        "Error updating configuration for " + field + ": " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
        <Typography variant="h5" mb={2}>
          {label}
        </Typography>
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
  const [leadSalesConsultantUnactive, setLeadSalesConsultantUnactive] =
    useState([]);
  const [leadSalesConsultantActive, setLeadSalesConsultantActive] = useState(
    []
  );
  const [leadStatusUnactive, setLeadStatusUnactive] = useState([]);
  const [leadStatusActive, setLeadStatusActive] = useState([]);

  const configFields = [
    {
      label: "Lead Source Management",
      name: "leadSource",
      unactiveData: leadSourceUnactive,
      activeData: leadSourceActive,
      setUnactiveData: setLeadSourceUnactive,
      setActiveData: setLeadSourceActive,
    },
    {
      label: "Lead Type Management",
      name: "leadType",
      unactiveData: leadTypeUnactive,
      activeData: leadTypeActive,
      setUnactiveData: setLeadTypeUnactive,
      setActiveData: setLeadTypeActive,
    },
    {
      label: "Lead Dealership Management",
      name: "leadDealership",
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
      name: "leadStatus",
      unactiveData: leadStatusUnactive,
      activeData: leadStatusActive,
      setUnactiveData: setLeadStatusUnactive,
      setActiveData: setLeadStatusActive,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "leadConfig", "configData");
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          configFields.forEach((field) => {
            const { name } = field;
            field.setUnactiveData(fetchedData[`${name}Unactive`] || []);
            field.setActiveData(fetchedData[`${name}Active`] || []);
          });
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
