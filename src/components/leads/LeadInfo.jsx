import React, { useState, useEffect, useCallback } from "react";
import { Box, Grid, Paper, Button } from "@mui/material";
import DropdownMenu from "../fields/renderDropdownMenu";
import { useFetchLeadConfig } from "../../../hooks/FetchLeadConfig";

const LeadInfo = ({ lead, onSaveLeadInfo, onInfoChange }) => {
  const {
    sourceOptions,
    typeOptions,
    dealershipOptions,
    statusOptions,
    loading,
    error,
  } = useFetchLeadConfig();

  const [editedLead, setEditedLead] = useState({
    leadSource: "",
    leadDealership: "",
    leadType: "",
    leadStatus: "",
  });

  useEffect(() => {
    setEditedLead({
      leadSource: lead?.leadSource || "",
      leadDealership: lead?.leadDealership || "",
      leadType: lead?.leadType || "",
      leadStatus: lead?.leadStatus || "",
    });
  }, [lead]);

  const handleDropdownChange = useCallback(
    (key, value) => {
      const updatedLead = { ...editedLead, [key]: value };
      setEditedLead(updatedLead);
      onInfoChange(true);
    },
    [editedLead, onInfoChange]
  );

  const saveChanges = useCallback(() => {
    onSaveLeadInfo(editedLead);
  }, [editedLead, onSaveLeadInfo]);

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box mb={1} mt={1} p={1}>
        <Grid container spacing={2}>
          {[
            { label: "Lead Source", key: "leadSource", options: sourceOptions },
            {
              label: "Lead Dealership",
              key: "leadDealership",
              options: dealershipOptions,
            },
            { label: "Lead Type", key: "leadType", options: typeOptions },
            { label: "Lead Status", key: "leadStatus", options: statusOptions },
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.key}>
              <DropdownMenu
                label={field.label}
                value={editedLead[field.key] || ""}
                options={field.options}
                onChange={(e) =>
                  handleDropdownChange(field.key, e.target.value)
                }
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button onClick={saveChanges} variant="outlined">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default React.memo(LeadInfo);
