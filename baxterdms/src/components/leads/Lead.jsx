import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Tab,
  TextField,
  Paper,
  IconButton,
  Grid,
  Button,
  Backdrop
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import EmailContact from "../contacts/EmailContact";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const Lead = ({ lead, showPanel, onClose }) => {
  const [value, setValue] = React.useState("1");
  const [isEmailPaperOpen, setIsEmailPaperOpen] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!lead) {
    return null;
  }

  const handleEmailClick = () => {
    setIsEmailPaperOpen(true);
  };

  const handleCloseEmailPaper = () => {
    setIsEmailPaperOpen(null);
  };

  return (
    <>
      {showPanel && (
        <Paper
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            width: "90%",
            height: "90vh",
            zIndex: 9999,
          }}
        >
          <IconButton
            aria-label="close"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 9999,
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ p: 2, width: "100%", typography: "body1" }}>
            {lead && (
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                  <TabList onChange={handleChange} centered variant="fullWidth">
                    <Tab
                      label={`${lead.firstName} ${lead.lastName}`}
                      disabled
                    />
                    <Tab label="Lead Information" value="1" />
                    <Tab label="Contact Information" value="2" />
                    <Tab label="Lead Vehicle" value="3" disabled />
                    <Tab label="Lead Trade-In" value="4" disabled />
                  </TabList>
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 3 }}>
                  <Typography variant="h6" sx={{ mb: 10 }}>
                    Status
                  </Typography>
                </Box>
                <TabPanel
                  value="1"
                  sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                  <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Lead Information
                    </Typography>
                    <TextField
                      variant="outlined"
                      label="Dealership"
                      value={lead.leadDealership}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <TextField
                      variant="outlined"
                      label="Status"
                      value={lead.leadStatus}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <br />
                    <TextField
                      variant="outlined"
                      label="Lead Source"
                      value={lead.leadSource}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <TextField
                      variant="outlined"
                      label="BDC Agent"
                      value={lead.leadBDCAgent}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <br />
                    <TextField
                      variant="outlined"
                      label="Lead Type"
                      value={lead.leadType}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <TextField
                      variant="outlined"
                      label="Sales Consultant"
                      value={lead.leadSalesConsultant}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <br />
                    <TextField
                      variant="outlined"
                      label="Vehicle of Interest"
                      value={lead.leadVehicle}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <TextField
                      variant="outlined"
                      label="Sales Manager"
                      value={lead.leadSalesManager}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <br />
                    <TextField
                      variant="outlined"
                      label="Trade-In"
                      value={lead.leadTradeVehicle}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                    <TextField
                      variant="outlined"
                      label="Finance Manager"
                      value={lead.leadFinanceManager}
                      disabled
                      sx={{ width: "45%", mr: 2, mb: 2 }}
                    />
                  </>
                </TabPanel>
                <TabPanel value="2">
                  {" "}
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Contact Information
                  </Typography>
                  <TextField
                    variant="outlined"
                    label="First Name"
                    value={lead.firstName}
                    disabled
                    sx={{ width: "30%", mr: 2, mb: 2 }}
                  />
                  <TextField
                    variant="outlined"
                    label="First Name"
                    value={lead.firstName}
                    disabled
                    sx={{ width: "30%", mr: 2, mb: 2 }}
                  />
                  <TextField
                    variant="outlined"
                    label="First Name"
                    value={lead.firstName}
                    disabled
                    sx={{ width: "30%", mr: 2, mb: 2 }}
                  />
                </TabPanel>
                <TabPanel value="3">Item Three</TabPanel>
              </TabContext>
            )}
          </Box>
          <Button variant="outlined" onClick={handleEmailClick}>
            <EmailOutlinedIcon sx={{ mr: 2 }} />
            EMAIL
          </Button>
        </Paper>
      )}

      {isEmailPaperOpen && (
        <>
          <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isEmailPaperOpen}
            onClick={handleCloseEmailPaper}
          />
          <EmailContact
            lead={lead}
            showPanel
            onClose={handleCloseEmailPaper}
          />
        </>
      )}
    </>
  );
};

export default Lead;
