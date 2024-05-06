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

// const LeadsSection = ({
//   label,
//   unactiveData,
//   activeData,
//   setUnactiveData,
//   setActiveData,
// }) => {
//   const [saveStatus, setSaveStatus] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSave = async (field) => {
//     setLoading(true);
//     const docRef = doc(db, "leadTaskConfig", "leadTaskConfig");
//     const dataToSend = {
//       [`lead${field}TypeUnactive`]: unactiveData,
//       [`lead${field}TypeActive`]: activeData,
//     };

//     try {
//       await updateDoc(docRef, dataToSend);
//       setSaveStatus("success");
//       console.log("Update successful");
//     } catch (error) {
//       console.error("Error updating configuration:", error);
//       setSaveStatus("error");
//     } finally {
//       setLoading(false);
//     }
//   };

const LeadsSection = ({
  label,
  unactiveData,
  activeData,
  setUnactiveData,
  setActiveData,
}) => {
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSave = async () => {
    setLoading(true);
    const field = label.replace(" Management", "").replaceAll(" ", "");
    const docRef = doc(db, "leadTaskConfig", "leadTaskConfig");
    const dataToSend = {
      [`lead${field}Unactive`]: unactiveData,
      [`lead${field}Active`]: activeData,
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
    const fetchData = async () => {
      const docRef = doc(db, "leadTaskConfig", "leadTaskConfig");
      try {
        const docSnap = await getDoc(docRef);
        console.log("Firestore snapshot:", docSnap); // Check the raw snapshot

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched data:", data); // Check fetched data

          setLeadTaskTypeUnactive(data.leadTaskTypeUnactive || []);
          setLeadTaskTypeActive(data.leadTaskTypeActive || []);
          setLeadTaskStatusUnactive(data.leadTaskStatusUnactive || []);
          setLeadTaskStatusActive(data.leadTaskStatusActive || []);
          setLeadTaskPriorityUnactive(data.leadTaskPriorityUnactive || []);
          setLeadTaskPriorityActive(data.leadTaskPriorityActive || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
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

export default LeadTaskConfig;
