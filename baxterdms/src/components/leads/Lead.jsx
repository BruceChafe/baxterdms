import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Button,
  Typography,
  Divider,
  BottomNavigation,
  Paper,
  Tab,
  Snackbar,
  Tooltip,
  IconButton,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";
import EmailContact from "../contacts/EmailCustomer";
import CustomBreadcrumbs from "../breadcrumbs/CustomBreadcrumbs";
import LeadHistory from "./LeadHistory";
import CreateLeadTask from "./CreateLeadTask";
import { EmailOutlined } from "@mui/icons-material";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { useFetchLeadAndContact } from "../../hooks/FetchLeadAndContact.jsx";

const Lead = () => {
  const { leadNumber } = useParams();
  const { lead, contact, primaryEmail, loading, error, refetch } =
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

  const handleSendEmailClick = () => {
    setSendEmailOpen(true);
  };

  const handleNewLeadTaskClick = () => {
    setCreateNewLeadTaskOpen(true);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    setEditedLead(lead);
    setEditedContact(contact);
  }, [lead, contact, primaryEmail]);

  const handleSave = async () => {
    try {
      const leadResponse = await fetch(
        `http://localhost:8000/leads/${lead?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(editedLead),
        }
      );

      const contactResponse = await fetch(
        `http://localhost:8000/contacts/${contact?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(editedContact),
        }
      );

      const timestamp = new Date().toISOString();

      if (leadResponse.ok && contactResponse.ok) {
        setSnackbarMessage("Save successful");
        setLeadInfoChanged(false);
        setContactInfoChanged(false);
        refetch();
      } else {
        setSnackbarMessage("Error: Failed to save");
      }

      const leadData = await leadResponse.json();

      const updatedHistory = [...leadData.history, [timestamp]];

      await fetch(`http://localhost:8000/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: updatedHistory,
        }),
      });

      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarOpen(true);
    }
  };

  const handleSaveSuccess = () => {
    setReloadLeadHistory((prevState) => !prevState);
  };

  const handleLeadInfoChange = (changed) => {
    setLeadInfoChanged(changed);
  };

  const handleContactInfoChange = (changed) => {
    setContactInfoChanged(changed);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {contact ? (
          <Typography variant="h4" sx={{ m: 2 }}>
            <CustomBreadcrumbs
              title={`${contact.firstName} ${contact.lastName} - ${
                lead?.leadStatus || ""
              } `}
            />
          </Typography>
        ) : (
          <CircularProgress sx={{ m: 2 }} />
        )}
        <Button
          onClick={handleSave}
          variant="outlined"
          disabled={!leadInfoChanged && !contactInfoChanged}
        >
          Save
        </Button>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          action={
            <Button color="inherit" size="small" onClick={handleSnackbarClose}>
              Close
            </Button>
          }
        />
      </Box>

      <Divider />
      <Box>
        <TabContext value={tabValue}>
          <Paper sx={{ pl: 1, pr: 1, mt: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <TabList
                onChange={handleChangeTab}
                textColor="secondary"
                indicatorColor="secondary"
              >
                <Tab label="Summary" value="1" />
                <Tab label="Contact " value="2" />
                <Tab label="History" value="3" />
                <Tab label="Trade-In" value="4" disabled />
              </TabList>
            </Box>
          </Paper>
          <TabPanel value="1">
            {lead && (
              <LeadInfo
                lead={lead}
                onSaveLeadInfo={setEditedLead}
                onInfoChange={handleLeadInfoChange}
              />
            )}
          </TabPanel>
          <TabPanel value="2">
            {contact && (
              <ContactInfo
                contact={contact}
                onSaveContactInfo={setEditedContact}
                onInfoChange={handleContactInfoChange}
              />
            )}
          </TabPanel>
          <TabPanel value="3">
            {lead && <LeadHistory leadData={lead} />}
          </TabPanel>

          <TabPanel value="4">Item Four</TabPanel>
        </TabContext>
      </Box>
      <Box></Box>
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
      <EmailContact
      key={primaryEmail}
        id={id}
        primaryEmail={primaryEmail}
        open={sendEmailOpen}
        onClose={() => setSendEmailOpen(false)}
        lead={lead}
        onSaveSuccess={handleSaveSuccess}
      />

      <CreateLeadTask
        lead={lead}
        id={leadId}
        open={createNewLeadOpen}
        onClose={() => setCreateNewLeadTaskOpen(false)}
        onSaveSuccess={handleSaveSuccess}
      />
    </Box>
  );
};

export default Lead;
