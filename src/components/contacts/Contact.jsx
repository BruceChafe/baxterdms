import React, { useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  BottomNavigation,
  Backdrop,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ContactInfo from "./ContactInfo";
import ContactLeads from "./ContactLeads";
import { EmailOutlined } from "@mui/icons-material";
import EmailContact from "./EmailCustomer";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";
import { useFetchContact } from "../../../hooks/FetchContact";

const Contact = () => {
  const { contactId } = useParams();
  const { contact, loading, error } = useFetchContact(contactId);
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

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      handleSave();
    }
  };

  // const handleSave = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/contacts/${contact.id}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-type": "application/json",
  //         },
  //         body: JSON.stringify(editedContact),
  //       }
  //     );

  //     if (response.ok) {
  //       setSnackbarMessage("Save successful");
  //       fetchContactData();
  //     } else {
  //       setSnackbarMessage("Error: Failed to save");
  //     }

  //     setSnackbarOpen(true);
  //     setIsEmailPaperOpen(false);
  //   } catch (error) {
  //     setSnackbarMessage(`Error: ${error.message}`);
  //     setSnackbarOpen(true);
  //   }
  // };

  const handleSave = async () => {
    try {
      // Fetch current data
      const fetchResponse = await fetch(`https://api.jsonbin.io/v3/b/6615a21dacd3cb34a835f9c3`, {
        method: "GET", // Explicitly stating the method for clarity
        headers: {
          'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu' 
        }
      });
  
      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch current contacts for update');
      }
  
      const currentData = await fetchResponse.json();
      let contacts = currentData.record.contacts;
  
      const contactIndex = contacts.findIndex(contact => contact.id === parseInt(contactId, 10));
      if (contactIndex === -1) {
        throw new Error(`Contact with id=${contactId} not found`);
      }
      console.log(editedContact)
  
      // Apply the edited fields to the contact
      contacts[contactIndex] = { ...contacts[contactIndex], ...editedContact };
  
      // Update the contacts data
      const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/6615a21dacd3cb34a835f9c3`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu' 
        },
        body: JSON.stringify({contacts}), // Ensure the entire contacts array is sent
      });
  
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(`Error: Failed to save. ${errorData.message}`);
      }
  
      // Update local UI state
      setContact(contacts[contactIndex]);
      setSnackbarMessage("Save successful");
  
    } catch (error) {
      console.error('Error saving contact data:', error);
      setSnackbarMessage(`Error: ${error.toString()}`);
    } finally {
      setSnackbarOpen(true);
      setIsEmailPaperOpen(false);
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
            {loading ? (
              <CircularProgress color="primary" />
            ) : (
              <Typography variant="h5">
                -{" "}
                {contact
                  ? `${contact.firstName} ${contact.lastName}`
                  : "Contact not found"}
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
        <>
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
        </>
      )}
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
