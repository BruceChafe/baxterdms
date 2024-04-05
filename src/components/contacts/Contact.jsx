import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  BottomNavigation,
  Backdrop,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ContactInfo from "./ContactInfo";
import ContactLeads from "./ContactLeads";
import { EmailOutlined } from "@mui/icons-material";
import EmailContact from "./EmailCustomer";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";

const Contact = () => {
  const { contactId } = useParams();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(null);
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [contactInfoChanged, setContactInfoChanged] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

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
    fetchContactData();
  }, [contactId]);

  const fetchContactData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/Contacts/${contactId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch contact data");
      }
      const data = await response.json();
      setContact(data);
    } catch (error) {
      console.error("Error fetching contact data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!contact) {
    return <Typography>No contact found</Typography>;
  }

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      handleSave();
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/contacts/${contact.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(editedContact),
        }
      );

      if (response.ok) {
        setSnackbarMessage("Save successful");
        fetchContactData();
      } else {
        setSnackbarMessage("Error: Failed to save");
      }

      setSnackbarOpen(true);
      setIsEmailPaperOpen(false);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  const handleContactInfoChange = (changed) => {
    setContactInfoChanged(changed);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4">Contacts</Typography>
            <Typography variant="h5">
              - {`${contact.firstName} ${contact.lastName}`}
            </Typography>
          </Box>
        }
        isEditable={isEditable}
        onToggleEdit={toggleEdit}
        saveDisabled={!contactInfoChanged}
      />

      <TabbedLayout
        tabs={[
          {
            label: "Basic Information",
            component: () => (
              <ContactInfo
                contact={contact}
                onSaveContactInfo={setEditedContact}
                onInfoChange={handleContactInfoChange}
                isEditable={isEditable}
              />
            ),
          },
          {
            label: "Leads",
            component: () => <ContactLeads contact={contact} />,
          },
        ]}
      />
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}
      >
        <Button onClick={handleEmailClick}>
          <EmailOutlined />{" "}
        </Button>
      </BottomNavigation>

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
