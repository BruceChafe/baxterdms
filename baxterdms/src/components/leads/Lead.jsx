import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Divider,
  Tab,
  Paper,
  CircularProgress,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";

const Lead = () => {
  const { leadNumber } = useParams();
  const [lead, setLead] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const leadResponse = await fetch(
          `http://localhost:8000/Leads/?leadNumber=${leadNumber}`
        );
        if (!leadResponse.ok) {
          throw new Error("Failed to fetch lead data");
        }
        const leadData = await leadResponse.json();
        console.log(leadData);

        const contactResponse = await fetch(
          `http://localhost:8000/contacts?leadNumbers_like=${leadNumber}`
        );
        if (!contactResponse.ok) {
          throw new Error("Failed to fetch contact data");
        }
        const contactData = await contactResponse.json();

        setLead(leadData[0] || null);
        setContact(contactData[0] || null);
      } catch (error) {
        console.error("Error fetching lead data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [leadNumber]);

  return (
    <Box m={3}>
      <Typography variant="h4" sx={{ m: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : lead && contact ? (
          `${contact.firstName} ${contact.lastName} - ${lead.leadStatus}`
        ) : (
          "Lead not found"
        )}
      </Typography>

      <Divider />
      <TabContext value={value}>
        <Paper sx={{ pl: 1, pr: 1, mt: 2, mb: 2 }}>
          <Box mb={1} mt={1} p={1}>
            <TabList
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label="Lead Summary" value="1" />
              <Tab label="Contact Information" value="2" />
              <Tab label="Vehicle" value="3" disabled />
              <Tab label="Trade-In" value="4" disabled />
            </TabList>
          </Box>
        </Paper>
        <TabPanel value="1">{lead && <LeadInfo lead={lead} />}</TabPanel>
        <TabPanel value="2">{/* Render contact information */}</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item Four</TabPanel>
      </TabContext>
    </Box>
  );
};

export default Lead;
