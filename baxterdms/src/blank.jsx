import React, { useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";
import EmailContact from "../contacts/EmailCustomer";
import CustomSnackbar from "../snackbar/CustomSnackbar";
import CustomBreadcrumbs from "../breadcrumbs/CustomBreadcrumbs";
import LeadHistory from "./LeadHistory";
import CreateLeadTask from "./CreateLeadTask";
import { EmailOutlined, AddTaskIcon } from "@mui/icons-material";
import useFetchLeadAndContact from "../hooks/useFetchLeadAndContact"; // Adjust this path according to your project structure

const Lead = () => {
  const { leadNumber } = useParams();
  const { lead, contact, loading, error, refetch } = useFetchLeadAndContact(leadNumber);
  const [tabValue, setTabValue] = useState("1");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [dialog, setDialog] = useState({ sendEmail: false, createNewLead: false });
  const [editedLead, setEditedLead] = useState(lead);
  const [editedContact, setEditedContact] = useState(contact);
  const [leadInfoChanged, setLeadInfoChanged] = useState(false);
  const [contactInfoChanged, setContactInfoChanged] = useState(false);

  const handleDialogOpen = (type) => {
    setDialog({ ...dialog, [type]: true });
  };

  const handleDialogClose = (type) => {
    setDialog({ ...dialog, [type]: false });
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const onSaveLeadInfo = (updatedLead) => {
    setEditedLead(updatedLead);
    setLeadInfoChanged(true);
  };

  const onSaveContactInfo = (updatedContact) => {
    setEditedContact(updatedContact);
    setContactInfoChanged(true);
  };

  const onInfoChange = (changed) => {
    if (changed) {
      setLeadInfoChanged(true);
      setContactInfoChanged(true);
    }
  };

  const handleSave = async () => {
    // Implement the save logic for both editedLead and editedContact
    // After successful save, reset change flags and refetch data
    setLeadInfoChanged(false);
    setContactInfoChanged(false);
    showSnackbar("Save successful!"); // Example
    refetch(); // Assuming refetch is implemented in your useFetchLeadAndContact hook
  };

  if (loading) return <CircularProgress />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box m={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" sx={{ m: 2 }}>
          Lead Details
        </Typography>
        <Button onClick={() => handleSave()} variant="outlined" disabled={!leadInfoChanged && !contactInfoChanged}>
          Save
        </Button>
      </Box>
      <CustomBreadcrumbs title={`${contact?.firstName} ${contact?.lastName} - ${lead?.leadStatus || ""}`} />

      <TabContext value={tabValue}>
        <Paper sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="lead detail tabs">
            <Tab label="Summary" value="1" />
            <Tab label="Contact" value="2" />
            <Tab label="History" value="3" />
          </TabList>
        </Paper>
        <TabPanel value="1">
          <LeadInfo lead={editedLead || lead} onSaveLeadInfo={onSaveLeadInfo} onInfoChange={onInfoChange} />
        </TabPanel>
        <TabPanel value="2">
          <ContactInfo contact={editedContact || contact} onSaveContactInfo={onSaveContactInfo} onInfoChange={onInfoChange} />
        </TabPanel>
        <TabPanel value="3">
          <LeadHistory lead={lead} />
        </TabPanel>
      </TabContext>

      <Button startIcon={<EmailOutlined />} onClick={() => handleDialogOpen('sendEmail')}>
        Send Email
      </Button>
      <Button startIcon={<AddTaskIcon />} onClick={() => handleDialogOpen('createNewLead')}>
        Create New Task
      </Button>

      <EmailContact open={dialog.sendEmail} onClose={() => handleDialogClose('sendEmail')} lead={lead} />
      <CreateLeadTask open={dialog.createNewLead} onClose={() => handleDialogClose('createNewLead')} lead={lead} />

      <CustomSnackbar open={snackbar.open} message={snackbar.message} handleClose={handleSnackbarClose} />
    </Box>
  );
};

export default Lead;
