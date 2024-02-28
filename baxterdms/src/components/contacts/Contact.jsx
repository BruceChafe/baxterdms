import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Divider,
  Tab,
  Paper,
  CircularProgress,
  Button,
  BottomNavigation,
  Backdrop,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import ContactInfo from "./ContactInfo";
import ContactLead from "./ContactLeads";
import { EmailOutlined } from "@mui/icons-material";
import EmailContact from "./EmailCustomer";

const Contact = () => {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("1");
  const [editedContact, setEditedContact] = useState(null)
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(null);
  const [primaryEmail, setPrimaryEmail] = useState("");

  const handleEmailClick = () => {
    setIsEmailPaperOpen(true);
  };

  const handleCloseEmailPaper = () => {
    setIsEmailPaperOpen(null);
  };

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
          setEditedContact[0] || null;
          setPrimaryEmail(data.email)
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

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/contacts/${contact.id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(editedContact),
      });
      if (!response.ok) {
        throw new Error("Failed to save contact data");
      }
    } catch (error) {
      console.error("Error updating contact:", error);
    }
  };

  return (
    <Box m={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ m: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : contact ? (
            `${contact.firstName} ${contact.lastName}`
          ) : (
            "Contact not found"
          )}
        </Typography>
        <Button onClick={handleSave} variant="outlined">
          Save
        </Button>
      </Box>
      <Divider />
      <TabContext value={value}>
        <Paper sx={{ pl: 1, pr: 1, mt: 2 }}>
          <Box mb={1} mt={1} p={1}>
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
        </Paper>
        <TabPanel value="1">
          {contact && (
            <Box>
              <ContactInfo contact={contact} onSaveContactInfo={setEditedContact} />
            </Box>
          )}
        </TabPanel>
        <TabPanel value="2">
          {contact && <ContactLead contact={contact} />}
        </TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
      <BottomNavigation sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99}}><Button onClick={handleEmailClick}><EmailOutlined/> </Button></BottomNavigation>
      {isEmailPaperOpen && (
          <>
            <Backdrop
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={isEmailPaperOpen}
              onClick={handleCloseEmailPaper}
            />
            <EmailContact
              contact={contact}
              primaryEmail={primaryEmail}
              showPanel
              onClose={handleCloseEmailPaper}
            />
          </>
        )}
    </Box>
  );
};

export default Contact;
