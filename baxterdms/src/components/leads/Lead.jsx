// Lead.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Divider,
  Tab,
  Paper,
  CircularProgress,
  Button,
  Grid,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";

const Lead = () => {
  const { leadNumber } = useParams();
  const [lead, setLead] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("1");
  const [editedLead, setEditedLead] = useState(null);
  const [editedContact, setEditedContact] = useState(null);

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

        const contactResponse = await fetch(
          `http://localhost:8000/contacts?leadNumbers_like=${leadNumber}`
        );
        if (!contactResponse.ok) {
          throw new Error("Failed to fetch contact data");
        }
        const contactData = await contactResponse.json();

        setLead(leadData[0] || null);
        setContact(contactData[0] || null);
        setEditedLead(leadData[0] || null);
        setEditedContact(contactData[0] || null);
      } catch (error) {
        console.error("Error fetching lead data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [leadNumber]);

  const handleSave = async () => {
    try {
      // Save lead data
      const leadResponse = await fetch(`http://localhost:8000/leads/${lead.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(editedLead),
      });
      if (!leadResponse.ok) {
        throw new Error("Failed to save lead data");
      }

      // Save contact data
      const contactResponse = await fetch(`http://localhost:8000/contacts/${contact.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(editedContact),
      });
      if (!contactResponse.ok) {
        throw new Error("Failed to save contact data");
      }
    } catch (error) {
      console.error("Error updating lead and contact:", error);
    }
  };

  return (
    <Box m={3}>
      <Grid container>
        <Grid item xs={11}>
          {" "}
          <Typography variant="h4" sx={{ m: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : lead && contact ? (
              `${contact.firstName} ${contact.lastName} - ${lead.leadStatus}`
            ) : (
              "Lead not found"
            )}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {" "}
          <Button onClick={handleSave} variant="outlined">
            Save
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <TabContext value={value}>
        <Paper sx={{ pl: 1, pr: 1, mt: 2 }}>
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
        <TabPanel value="1">
          {lead && <LeadInfo lead={lead} onSaveLeadInfo={setEditedLead} />}
        </TabPanel>
        <TabPanel value="2">
          {contact && <ContactInfo contact={contact} onSaveContactInfo={setEditedContact} />}
        </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
        <TabPanel value="4">Item Four</TabPanel>
      </TabContext>
    </Box>
  );
};

export default Lead;
