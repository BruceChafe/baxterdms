import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, CircularProgress, Typography, BottomNavigation, Tooltip, IconButton, Snackbar, Container, Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";
import EmailContact from "../contacts/EmailCustomer";
import LeadHistory from "./LeadHistory";
import LeadVehicle from "./LeadVehicle";
import CreateLeadTask from "./CreateLeadTask";
import { EmailOutlined } from "@mui/icons-material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";
import { useFetchLeadAndContact } from "../../../hooks/FetchLeadAndContact";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Lead = () => {
  const { leadNumber } = useParams();
  const { lead, contact, primaryEmail, loading, error } = useFetchLeadAndContact(leadNumber);
  console.log("Lead Number from URL:", leadNumber);
  const [editedLead, setEditedLead] = useState(null);
  const [editedContact, setEditedContact] = useState({});
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(false);
  const [createNewLeadOpen, setCreateNewLeadTaskOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [contactInfoChanged, setContactInfoChanged] = useState(false);

  const leadId = lead?.id;

  

  const handleSnackbar = useCallback((message, open) => {
    setSnackbarMessage(message);
    setSnackbarOpen(open);
  }, []);

  const toggleEdit = () => {
    setIsEditable(!isEditable);
    if (isEditable) {
      handleSave();
    }
  };

  const handleSave = async () => {
    if (!editedContact || Object.keys(editedContact).length === 0) {
      handleSnackbar("No changes to save", true);
      return;
    }
    const contactId = contact?.id; // Assuming contact ID is stored in contact data
    const contactRef = doc(db, "contacts", contactId);

    try {
      await updateDoc(contactRef, editedContact);
      handleSnackbar("Save successful", true);
      setContactInfoChanged(false);
    } catch (error) {
      console.error("Error updating contact:", error);
      handleSnackbar(`Error: ${error.message}`, true);
    } finally {
      setIsEditable(false);
    }
  };

  const tabs = useMemo(() => [
    { label: "Summary", component: () => <LeadInfo lead={lead} onSaveLeadInfo={setEditedLead} /> },
    { label: "Contact", component: () => <ContactInfo contact={contact} onSaveContactInfo={setEditedContact} isEditable={isEditable} /> },
    { label: "Vehicle", component: () => <LeadVehicle vehicleId={lead?.vehicleIDs?.[0]} leadId={leadId} /> },
  ], [lead, contact, isEditable, leadId]);

  useEffect(() => {
    if (error) {
      handleSnackbar(error, true);
    }
  }, [error, handleSnackbar]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">Lead - {contact ? `${contact.firstName} ${contact.lastName}` : "Contact not found"}</Typography>}
        isEditable={isEditable}
        onToggleEdit={() => setIsEditable(!isEditable)}
        saveDisabled={!contactInfoChanged}
      />
      {loading ? (
        <Container>
          <CircularProgress color="primary" />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Fetching data, please wait...</Typography>
        </Container>
      ) : (
        <TabbedLayout tabs={tabs} />
      )}
      <BottomNavigation sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}>
        <Tooltip title="Send Email"><IconButton onClick={() => setIsEmailPaperOpen(true)}><EmailOutlined /></IconButton></Tooltip>
        <Tooltip title="Create Task"><IconButton onClick={() => setCreateNewLeadTaskOpen(true)} color="primary"><AddTaskIcon /></IconButton></Tooltip>
      </BottomNavigation>
      {isEmailPaperOpen && <EmailContact open={isEmailPaperOpen} contact={contact} primaryEmail={primaryEmail || ""} onClose={() => setIsEmailPaperOpen(false)} />}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </Box>
  );
};

export default Lead;
