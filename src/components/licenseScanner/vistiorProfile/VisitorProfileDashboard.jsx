import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Container
} from "@mui/material";
import { useParams } from "react-router-dom";
import ContactInfo from "./ContactInfo";
import ContactLeads from "./ContactLeads";
import EmailContact from "./EmailCustomer";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";
import { useFetchContact } from "../../../hooks/FetchContact";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useSnackbar } from "../../context/SnackbarContext";

const Contact = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();
  const { contact, setContact, loading, error } = useFetchContact(contactId);
  const [editedContact, setEditedContact] = useState({});
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(false);
  const [contactInfoChanged, setContactInfoChanged] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const { showSnackbar } = useSnackbar();

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
      showSnackbar("No changes to save", "info");
      return;
    }

    const contactRef = doc(db, "contacts", contactId);

    try {
      await updateDoc(contactRef, editedContact);
      setContact((prev) => ({ ...prev, ...editedContact }));
      showSnackbar("Save successful", "success");
      setContactInfoChanged(false);
    } catch (error) {
      console.error("Error updating contact:", error);
      showSnackbar(`Error: ${error.message}`, "error");
    } finally {
      setIsEditable(false);
    }
  };

  const handleContactInfoChange = (changed) => {
    setContactInfoChanged(changed);
  };

  const handleNewLeadClick = () => {
    navigate(`/leads/newlead/${contactId}`);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4">Contact </Typography>
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
        actionButtons={[
          {
            label: "New Lead",
            onClick: handleNewLeadClick,
          },
        ]}
      />
      {loading ? (
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
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
      {isEmailPaperOpen && (
        <EmailContact
          contact={contact}
          primaryEmail={contact?.primaryEmail || ""}
          showPanel
          onClose={handleCloseEmailPaper}
        />
      )}
    </Box>
  );
};

export default Contact;
