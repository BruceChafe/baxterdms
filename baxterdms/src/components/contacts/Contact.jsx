import React, { useState } from "react";
import { Paper, IconButton, Box, Grid, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContactSidebarComponent from "./ContactSidebarMenu";
import ContactInfo from "./ContactInfo";
import ContactLeads from "./ContactLeads";
import ContactVehicles from "./ContactVehicles";

const Contact = ({ contact, showPanel, onClose, navigationLinks }) => {
  const [value, setValue] = useState("Basic Information");

  const handleNavigationLinkClick = (selectedTab) => {
    setValue(selectedTab);
  };

  if (!contact) {
    return null;
  }

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

          <Grid container>
            <Grid item xs={2}>
              <ContactSidebarComponent
                contact={contact}
                navigationLinks={navigationLinks}
                onNavigationLinkClick={handleNavigationLinkClick}
              />
            </Grid>

            <Grid item xs={10}>
              <Box sx={{ marginLeft: "10px" }}>
                {value === "Basic Information" && (
                  <ContactInfo contact={contact} />
                )}
                {value === "Leads" && <ContactLeads />}
                {value === "Vehicles" && contact.dmsID && <ContactVehicles dmsID={contact.dmsID} />}

                {value === "Sales"}
                {value === "Finance"}
                {value === "Privacy" && <ContactPrivacy />}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default Contact;
