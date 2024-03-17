import React, { useState, useEffect } from "react";
import { Box, Grid, Paper } from "@mui/material";
import DropdownMenu from "../fields/renderDropdownMenu";
import { useFetchLeadConfig } from "../../hooks/FetchLeadConfig";

const LeadInfo = ({ lead, onSaveLeadInfo, onInfoChange }) => {
  const { sourceOptions, typeOptions, dealershipOptions, statusOptions } =
    useFetchLeadConfig();

  const [editedLead, setEditedLead] = useState(null);

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
                      handleDropdownChange("leadDealership", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DropdownMenu
                    label="Lead Type"
                    value={editedLead?.leadType || ""}
                    options={typeOptions}
                    onChange={(e) =>
                      handleDropdownChange("leadType", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DropdownMenu
                    label="Lead Status"
                    value={editedLead?.leadStatus || ""}
                    options={statusOptions}
                    onChange={(e) =>
                      handleDropdownChange("leadStatus", e.target.value)
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
