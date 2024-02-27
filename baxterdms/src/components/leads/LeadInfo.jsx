// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   TextField,
//   Divider,
//   Box,
//   Button,
//   Grid,
// } from "@mui/material";

// const LeadInfo = ({ lead }) => {
//   const [leadFields, setLeadFields] = useState({});
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editedLead, setEditedLead] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8000/configLeads/1")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch configuration data");
//         }
//         return response.json();
//       })
//       .then((configData) => {
//         const sourceOptions = configData.leadSourceActive || [];
//         const typeOptions = configData.leadTypeActive || [];
//         const statusOptions = configData.leadStatusActive || [];
//         const dealershipOptions = configData.leadDealershipActive || [];

//         setSourceOptions(sourceOptions);
//         setTypeOptions(typeOptions);
//         setDealershipOptions(dealershipOptions);
//         setStatusOptions(statusOptions);
//       })
//       .catch((error) => {
//         console.error("Error fetching options:", error);
//       });
//   }, []);

//   useEffect(() => {
//     setEditedLead({ ...lead });
//   }, [lead]);

//   const leadSummaryFields = [
//     { label: "Source", key: "leadSource" },
//     { label: "Type", key: "leadType" },
//     { label: "Status", key: "leadStatus" },
//     { label: "Vehicle", key: "leadVehicle" },
//     { label: "Dealership", key: "leadDealership" },
//     { label: "Sales Consultant", key: "leadSalesConsultant" },
//   ];

//   const handleEditToggle = () => {
//     setIsEditMode((prevMode) => !prevMode);
//   };

//   const handleFieldChange = (key, value) => {
//     setEditedLead({
//       ...editedLead,
//       [key]: value,
//     });
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/leads/${lead.id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-type": "application/json",
//         },
//         body: JSON.stringify(editedLead),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to save lead data");
//       }
//       const updatedLead = await response.json();
//       setIsEditMode(false);
//     } catch (error) {
//       console.error("Error updating lead:", error);
//     }
//   };

//   const renderTextField = (label, key, value) => (
//     <TextField
//       variant="outlined"
//       label={label}
//       value={value}
//       onChange={(e) => handleFieldChange(key, e.target.value)}
//       InputProps={{
//         readOnly: !isEditMode,
//       }}
//       fullWidth
//       disabled={!isEditMode}
//     />
//   );

//   const renderSection = (sectionLabel, fields) => (
//     <Box sx={{ mb: 2 }}>
//       {/* <Typography variant="h6" sx={{ mb: 2 }}>
//         {sectionLabel}
//       </Typography> */}
//       <Grid container spacing={2}>
//         {fields.map((field) => (
//           <Grid item xs={12} sm={6} key={field.label}>
//             {renderTextField(
//               field.label,
//               field.key,
//               editedLead[field.key] || ""
//             )}
//           </Grid>
//         ))}
//       </Grid>
//       <Divider sx={{ mt: 2, mb: 2 }} />
//     </Box>
//   );

//   return (
//     <Box>
//       <Button
//         onClick={isEditMode ? handleSave : handleEditToggle}
//         variant="outlined"
//         sx={{ mb: 2 }}
//       >
//         {isEditMode ? "Save" : "Edit"}
//       </Button>

//       {editedLead && renderSection("", leadSummaryFields)}
//     </Box>
//   );
// };

// export default LeadInfo;

import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Divider,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
} from "@mui/material";

const LeadInfo = ({ lead }) => {
  const [editedLead, setEditedLead] = useState(null);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [dealershipOptions, setDealershipOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/configLeads/1")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch configuration data");
        }
        return response.json();
      })
      .then((configData) => {
        const sourceOptions = configData.leadSourceActive || [];
        const typeOptions = configData.leadTypeActive || [];
        const statusOptions = configData.leadStatusActive || [];
        const dealershipOptions = configData.leadDealershipActive || [];

        setSourceOptions(sourceOptions);
        setTypeOptions(typeOptions);
        setDealershipOptions(dealershipOptions);
        setStatusOptions(statusOptions);
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
      });
  }, []);

  useEffect(() => {
    setEditedLead({ ...lead });
  }, [lead]);

  const handleDropdownChange = (key, value) => {
    setEditedLead({
      ...editedLead,
      [key]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(editedLead),
      });
      if (!response.ok) {
        throw new Error("Failed to save lead data");
      }
      const updatedLead = await response.json();
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const renderDropdownMenu = (label, key, options, isDisabled = false) => (
    <TextField
      select
      label={label}
      value={editedLead[key] || ""}
      onChange={(e) => handleDropdownChange(key, e.target.value)}
      fullWidth
      disabled={isDisabled}
    >
      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      {editedLead && (
        <Box>
          <Button onClick={handleSave} variant="outlined">
            Save
          </Button>
          <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu(
                    "Lead Source",
                    "leadSource",
                    sourceOptions
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu(
                    "Lead Dealership",
                    "leadDealership",
                    dealershipOptions,
                    true
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu("Lead Type", "leadType", typeOptions)}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {renderDropdownMenu(
                    "Lead Status",
                    "leadStatus",
                    statusOptions
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
          <Divider />
        </Box>
      )}
    </>
  );
};

export default LeadInfo;