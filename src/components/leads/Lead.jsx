import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  BottomNavigation,
  Tooltip,
  IconButton,
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
const Lead = () => {
  const { leadNumber } = useParams();
  const { lead, contact, primaryEmail, loading, error } =
    useFetchLeadAndContact(leadNumber);
  const [tabValue, setTabValue] = useState("1");
  const [editedLead, setEditedLead] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const leadId = lead?.id;
  const [sendEmailOpen, setSendEmailOpen] = useState(null);
  const [createNewLeadOpen, setCreateNewLeadTaskOpen] = useState(false);
  const [id, setID] = useState("");
  const [reloadLeadHistory, setReloadLeadHistory] = useState(false);

  const [leadInfoChanged, setLeadInfoChanged] = useState(false);
  const [contactInfoChanged, setContactInfoChanged] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    setEditedLead(lead);
    setEditedContact(contact);
  }, [lead, contact, primaryEmail]);

  const handleSendEmailClick = () => {
    setSendEmailOpen(true);
  };

  const handleNewLeadTaskClick = () => {
    setCreateNewLeadTaskOpen(true);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress sx={{ m: 2 }} />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      {contact ? (
        <TitleLayout
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h4">Leads</Typography>
              <Typography variant="h5">
                - {`${contact.firstName} ${contact.lastName}`}
              </Typography>
            </Box>
          }
          isEditable={isEditable}
          onToggleEdit={toggleEdit}
          saveDisabled={!contactInfoChanged && !leadInfoChanged}
        />
      ) : (
        <Typography>No contact data available</Typography>
      )}
      <Box>
        {/* <TabbedLayout
          tabs={[
            {
              label: "Summary",
              component: () => (
                <LeadInfo
                  lead={lead}
                  onSaveLeadInfo={setEditedLead}
                  onInfoChange={handleLeadInfoChange}
                />
              ),
            },
            {
              label: "Contact",
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
              label: "History",
              component: () => <LeadHistory leadData={lead} />,
            },
            {
              label: "Vehicle",
              component: () => <LeadVehicle leadData={lead} />,
            },
          ]}
        /> */}
      </Box>
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}
      >
        <Tooltip title="Send Email">
          <IconButton onClick={handleSendEmailClick} color="primary">
            <EmailOutlined />
          </IconButton>
        </Tooltip>

        <Tooltip title="Create Task">
          <IconButton onClick={handleNewLeadTaskClick} color="primary">
            <AddTaskIcon />
          </IconButton>
        </Tooltip>
      </BottomNavigation>
      {/* <EmailContact
        key={primaryEmail}
        id={id}
        primaryEmail={primaryEmail}
        open={sendEmailOpen}
        onClose={() => setSendEmailOpen(false)}
        lead={lead}
        onSaveSuccess={handleSaveSuccess}
      /> */}
      {/* <CreateLeadTask
        lead={lead}
        id={leadId}
        open={createNewLeadOpen}
        onClose={() => setCreateNewLeadTaskOpen(false)}
        onSaveSuccess={handleSaveSuccess}
      /> */}
    </Box>
  );
};

export default Lead;
