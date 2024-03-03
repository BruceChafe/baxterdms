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
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useParams } from "react-router-dom";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";
import { EmailOutlined } from "@mui/icons-material";
import EmailContact from "../contacts/EmailCustomer"
import CustomSnackbar from "../snackbar/CustomSnackbar";
import CustomBreadcrumbs from "../breadcrumbs/CustomBreadcrumbs";
import LeadHistory from "./LeadHistory";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CreateLeadTask from "./CreateLeadTask";

const Lead = () => {
  const { leadNumber } = useParams();
  const [lead, setLead] = useState(null);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState("1");
  const [editedLead, setEditedLead] = useState(null);
  const [editedContact, setEditedContact] = useState(null);
  const [sendEmailOpen, setSendEmailOpen] = useState(null);
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [createNewLeadOpen, setCreateNewLeadOpen] = useState(false);

  const [id, setID] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSendEmailClick = () => {
    setSendEmailOpen(true);
  };

  const handleNewLeadClick = () => {
    setCreateNewLeadOpen(true);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchLeadData = async () => {
    try {
      const leadResponse = await fetch(
        `http://localhost:8000/Leads/?leadNumber=${leadNumber}`
      );
      if (!leadResponse.ok) {
        throw new Error("Failed to fetch lead data");
      }
      const leadData = await leadResponse.json();

      const contactResponse = await fetch(
        `http://localhost:8000/contacts?leadNumbers_like=${leadNumber}`
      );
      if (!contactResponse.ok) {
        throw new Error("Failed to fetch contact data");
      }
      const contactData = await contactResponse.json();

      setLead(leadData[0] || null);
      setContact(contactData[0] || null);
      setEditedLead(leadData[0] || null);
      setID(leadData[0]?.id || "");
      setEditedContact(contactData[0] || null);
      setPrimaryEmail(contactData[0]?.email || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lead data:", error);
    }
  };

  useEffect(() => {
    fetchLeadData();
  }, [leadNumber]);

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
        fetchLeadData();
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
      setSendEmailOpen(false);
    } catch (error) {
      setSnackbarMessage(`Error: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

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
        <Button onClick={handleSave} variant="outlined">
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
        <TabContext value={value}>
          <Paper sx={{ pl: 1, pr: 1, mt: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <TabList
                onChange={handleChange}
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
            {lead && <LeadInfo lead={lead} onSaveLeadInfo={setEditedLead} />}
          </TabPanel>
          <TabPanel value="2">
            {contact && (
              <ContactInfo
                contact={contact}
                onSaveContactInfo={setEditedContact}
              />
            )}
          </TabPanel>
          <TabPanel value="3">
  {lead && <LeadHistory leadData={lead} tasks={lead.tasks || []} />}
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
      />
      <CreateLeadTask
      lead={lead}
      id={id}
        open={createNewLeadOpen}
        onClose={() => setCreateNewLeadOpen(false)}
      />
    </Box>
  );
};

export default Lead;
