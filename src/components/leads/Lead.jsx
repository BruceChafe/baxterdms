import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  BottomNavigation,
  Tooltip,
  IconButton,
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
import { useSnackbar } from "../../context/SnackbarContext";

const Lead = () => {
  const navigate = useNavigate();
  const { leadNumber } = useParams();
  const { lead, contact, vehicle, primaryEmail, loading, error, refetch } =
    useFetchLeadAndContact(leadNumber);
  const [editedContact, setEditedContact] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [sendEmailOpen, setSendEmailOpen] = useState(null);
  const [createNewLeadTaskOpen, setCreateNewLeadTaskOpen] = useState(false);
  const [contactInfoChanged, setContactInfoChanged] = useState(false);
  const contactId = contact?.id;
  const { showSnackbar } = useSnackbar();

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

  const handleVehicleRemoved = async () => {
    try {
      refetch();
      showSnackbar("Vehicle removed successfully.", "success");
    } catch (error) {
      console.error("Error updating data:", error);
      showSnackbar(`Failed to update data: ${error.message}`, "error");
    }
  };

  const handleVehicleAdded = async () => {
    try {
      refetch();
      showSnackbar("Vehicle added successfully.", "success");
    } catch (error) {
      console.error("Error updating data:", error);
      showSnackbar(`Failed to update data: ${error.message}`, "error");
    }
  };

  const handleSaveSuccess = () => {
    showSnackbar("Operation successful", "success");
  };

  const handleContactInfoChange = (changed) => {
    setContactInfoChanged(changed);
  };

  const handleSendEmailClick = () => {
    setSendEmailOpen(true);
  };

  const handleNewLeadTaskClick = () => {
    setCreateNewLeadTaskOpen(true);
  };

  const handleViewContactClick = () => {
    if (contact?.id) {
      navigate(`/contacts/${contact.id}`);
    } else {
      console.error("No contact ID available");
    }
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
            onInfoChange={handleContactInfoChange}
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
        component: () => <LeadHistory leadId={leadId} />,
      },
    ],
    [lead, contact, isEditable, vehicle]
  );

  const leadId = lead?.id;

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4">Lead </Typography>
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
            label: "View Contact",
            onClick: handleViewContactClick,
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
        <TabbedLayout tabs={tabs} />
      )}
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
    </Box>
  );
};

export default Lead;
