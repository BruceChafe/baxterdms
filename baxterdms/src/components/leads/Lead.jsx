import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Button, Typography, Divider, BottomNavigation, Paper, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";
import EmailContact from "../contacts/EmailCustomer";
import CustomSnackbar from "../snackbar/CustomSnackbar";
import CustomBreadcrumbs from "../breadcrumbs/CustomBreadcrumbs";
import LeadHistory from "./LeadHistory";
import CreateLeadTask from "./CreateLeadTask";
import { EmailOutlined } from "@mui/icons-material";
import AddTaskIcon from "@mui/icons-material/AddTask";

import { useFetchLeadAndContact } from "../../hooks/FetchLeadAndContact";

const Lead = () => {
  const { leadNumber } = useParams();
  const { lead, contact, loading, error, refetch } = useFetchLeadAndContact(leadNumber);
  const [tabValue, setTabValue] = useState("1");
  const [editedLead, setEditedLead] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const leadId = lead?.id;


  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const [sendEmailOpen, setSendEmailOpen] = useState(null);
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [createNewLeadOpen, setCreateNewLeadOpen] = useState(false);
  const [id, setID] = useState("");
  const [reloadLeadHistory, setReloadLeadHistory] = useState(false);

  const [leadInfoChanged, setLeadInfoChanged] = useState(false);
  const [contactInfoChanged, setContactInfoChanged] = useState(false);

  const handleSendEmailClick = () => {
    setSendEmailOpen(true);
  };

  const handleNewLeadClick = () => {
    setCreateNewLeadOpen(true);
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

  useEffect(() => {
    setEditedLead(lead);
    setEditedContact(contact);
  }, [lead, contact]);

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
        showSnackbar("Save successful");
        setLeadInfoChanged(false);
        setContactInfoChanged(false);
        refetch();
      } else {
        showSnackbar("Error: Failed to save");
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

      showSnackbar(true);
      setSendEmailOpen(false);
    } catch (error) {
      showSnackbar(`Error: ${error.message}`);
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

  if (loading) return <CircularProgress />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box m={3}>
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
        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          handleClose={handleSnackbarClose}
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
            {lead && (
              <LeadHistory
                leadData={lead}
                tasks={lead.tasks || []}
                emails={lead.emails || []}
              />
            )}
          </TabPanel>

          <TabPanel value="4">Item Four</TabPanel>
        </TabContext>
      </Box>
      <Box></Box>
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}
      >
        <Button onClick={handleSendEmailClick}>
          <EmailOutlined />
        </Button>
        <Button onClick={handleNewLeadClick}>
          <AddTaskIcon />
        </Button>
      </BottomNavigation>
      <EmailContact
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
        onClose={() => setCreateNewLeadOpen(false)}
        onSaveSuccess={handleSaveSuccess}
      />
    </Box>
  );
};

export default Lead;
