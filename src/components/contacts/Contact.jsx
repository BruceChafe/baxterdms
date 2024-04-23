import React, { useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  BottomNavigation,
  Backdrop,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ContactInfo from "./ContactInfo";
import ContactLeads from "./ContactLeads";
import { EmailOutlined } from "@mui/icons-material";
import EmailContact from "./EmailCustomer";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";
import { useFetchContact } from "../../../hooks/FetchContact";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Contact = () => {
  const { contactId } = useParams();
  const { contact, setContact, loading, error } = useFetchContact(contactId);
  const [editedContact, setEditedContact] = useState({});
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(false);
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
    setIsEmailPaperOpen(false);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!editedContact || Object.keys(editedContact).length === 0) {
      setSnackbarMessage("No changes to save");
      setSnackbarOpen(true);
      return;
    }

    const contactRef = doc(db, "contacts", contactId);

    try {
      await updateDoc(contactRef, editedContact);
      setContact(prev => ({ ...prev, ...editedContact }));
      setSnackbarMessage("Save successful");
      setContactInfoChanged(false);
    } catch (error) {
      console.error("Error updating contact:", error);
      setSnackbarMessage(`Error: ${error.message}`);
    } finally {
      setSnackbarOpen(true);
      setIsEditable(false);
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
            <Typography variant="h4">Contact Details</Typography>
            {loading ? (
              <CircularProgress color="primary" />
            ) : (
              <Typography variant="h5">
                - {contact ? `${contact.firstName} ${contact.lastName}` : "Contact not found"}
              </Typography>
            )}
          </Box>
        }
        isEditable={isEditable}
        onToggleEdit={toggleEdit}
        saveDisabled={!contactInfoChanged}
      />
      {loading ? (
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            flexDirection="column"
          >
            <CircularProgress color="primary" />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Fetching data, please wait...
            </Typography>
          </Box>
        </Container>
      ) : (
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
      )}
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}
      >
        <Button onClick={handleEmailClick}>
          <EmailOutlined /> Email
        </Button>
      </BottomNavigation>

      {isEmailPaperOpen && (
        <EmailContact
          contact={contact}
          primaryEmail={contact?.primaryEmail || ""}
          showPanel
          onClose={handleCloseEmailPaper}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Contact;
