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
import ContactInfo from "./ContactInfo";
import ContactLead from "./ContactLeads";

const Contact = () => {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/Contacts/${contactId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch contact data");
        }
        const data = await response.json();
        if (data) {
          setContact(data);
        } else {
          throw new Error("Contact not found");
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [contactId]);

  return (
    <Box m={3}>
      <Typography variant="h4" sx={{ m: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : contact ? (
          `${contact.firstName} ${contact.lastName}`
        ) : (
          "Contact not found"
        )}
      </Typography>
      <Divider />
      <Paper sx={{ pl: 1, pr: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab label="Basic Information" value="1" />
                <Tab label="Leads" value="2" />
                <Tab label="Vehicles" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              {contact && <ContactInfo contact={contact} />}
            </TabPanel>
            <TabPanel value="2">
              {" "}
              {contact && <ContactLead contact={contact} />}
            </TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </Paper>
    </Box>
  );
};

export default Contact;
