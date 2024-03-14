import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import DropdownMenu from "../fields/renderDropdownMenu";

const LeadInfo = ({ lead, onSaveLeadInfo, onInfoChange }) => {
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
    onInfoChange(true);
  };

  useEffect(() => {
    if (editedLead) {
      onSaveLeadInfo(editedLead);
    }
  }, [editedLead, onSaveLeadInfo]);

  return (
    <>
      {editedLead && (
        <Box>
          <Paper sx={{ p: 1, mb: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DropdownMenu
                    label="Lead Source"
                    value={editedLead?.leadSource || ""}
                    options={sourceOptions}
                    onChange={(e) =>
                      handleDropdownChange("leadSource", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DropdownMenu
                    label="Lead Dealership"
                    value={editedLead?.leadDealership || ""}
                    options={dealershipOptions}
                    onChange={(e) =>
                      handleDropdownChange("leadSource", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DropdownMenu
                    label="Lead Type"
                    value={editedLead?.leadType || ""}
                    options={typeOptions}
                    onChange={(e) =>
                      handleDropdownChange("leadSource", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DropdownMenu
                    label="Lead Status"
                    value={editedLead?.leadStatus || ""}
                    options={statusOptions}
                    onChange={(e) =>
                      handleDropdownChange("leadSource", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default LeadInfo;
