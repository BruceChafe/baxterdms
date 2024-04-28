import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  BottomNavigation,
  Tooltip,
  IconButton,
  Snackbar,
  Container,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { EmailOutlined } from "@mui/icons-material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import LeadInfo from "./LeadInfo";
import ContactInfo from "../contacts/ContactInfo";
import EmailContact from "../contacts/EmailCustomer";
import LeadVehicle from "./LeadVehicle";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";
import CreateLeadTask from "./CreateLeadTask";
import LeadHistory from "./LeadHistory";
import { useFetchLeadAndContact } from "../../../hooks/FetchLeadAndContact";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Lead = () => {
  const { leadNumber } = useParams();
  const { lead, contact, vehicle, primaryEmail, loading, error, refetch } =
    useFetchLeadAndContact(leadNumber);
  const [editedContact, setEditedContact] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(null);
  const [createNewLeadTaskOpen, setCreateNewLeadTaskOpen] = useState(false);

  const handleSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSave = async () => {
    if (!editedContact || Object.keys(editedContact).length === 0) {
      handleSnackbar("No changes to save");
      return;
    }
    const contactId = contact?.id;
    const contactRef = doc(db, "contacts", contactId);

    try {
      await updateDoc(contactRef, editedContact);
      handleSnackbar("Save successful");
    } catch (error) {
      console.error("Error updating contact:", error);
      handleSnackbar(`Error: ${error.message}`);
    } finally {
      setIsEditable(false);
    }
  };

  const handleVehicleRemoved = async () => {
    try {
      refetch();
      handleSnackbar("Vehicle removed successfully.");
    } catch (error) {
      console.error("Error updating data:", error);
      handleSnackbar(`Failed to update data: ${error.message}`);
    }
  };

  const handleVehicleAdded = async () => {
    try {
      refetch();
      handleSnackbar("Vehicle added successfully.");
    } catch (error) {
      console.error("Error updating data:", error);
      handleSnackbar(`Failed to update data: ${error.message}`);
    }
  };

  const handleSaveSuccess = () => {
    // setReloadLeadHistory((prevState) => !prevState);
  };

  const handleSendEmailClick = () => {
    setSendEmailOpen(true);
  };

  const handleNewLeadTaskClick = () => {
    setCreateNewLeadTaskOpen(true);
  };

  const tabs = useMemo(
    () => [
      {
        label: "Summary",
        component: () => (
          <LeadInfo lead={lead} onSaveLeadInfo={setEditedContact} />
        ),
      },
      {
        label: "Contact",
        component: () => (
          <ContactInfo
            contact={contact}
            onSaveContactInfo={setEditedContact}
            isEditable={isEditable}
          />
        ),
      },
      {
        label: "Vehicle",
        component: () => (
          <LeadVehicle
            vehicleId={lead?.vehicleIDs}
            vehicle={Array.isArray(vehicle) ? vehicle : [vehicle]}
            leadId={leadId}
            onVehicleRemoved={handleVehicleRemoved}
            onVehicleAdded={handleVehicleAdded}
          />
        ),
      },
       {
        label: "History",
        component: () => (
          <LeadHistory
          leadId={leadId}        
          />
        ),
      },
    ],
    [lead, contact, isEditable, vehicle]
  );

  const leadId = lead?.id;

  useEffect(() => {
    if (error) {
      handleSnackbar(error);
    }
  }, [error]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={
          <Typography variant="h4">
            Lead -{" "}
            {contact
              ? `${contact.firstName} ${contact.lastName}`
              : "Contact not found"}
          </Typography>
        }
        isEditable={isEditable}
        onToggleEdit={() => setIsEditable(!isEditable)}
      />
      {loading ? (
        <Container>
          <CircularProgress color="primary" />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Fetching data, please wait...
          </Typography>
        </Container>
      ) : (
        <TabbedLayout tabs={tabs} />
      )}
      <BottomNavigation
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99 }}
      >
        <Tooltip title="Send Email">
          <IconButton onClick={handleSendEmailClick}>
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
        primaryEmail={primaryEmail}
        open={sendEmailOpen}
        onClose={() => setSendEmailOpen(false)}
        lead={lead}
        onSaveSuccess={handleSaveSuccess}
      />
      <CreateLeadTask
        lead={lead}
        leadId={leadId}
        open={createNewLeadTaskOpen}
        onClose={() => setCreateNewLeadTaskOpen(false)}
        onSaveSuccess={handleSaveSuccess}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Lead;