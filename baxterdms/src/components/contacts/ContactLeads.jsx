import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";

const ContactLead = ({ dmsID }) => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/leads?dmsID=${dmsID}`)
      .then((response) => response.json())
      .then((data) => setLeads(data || []))
      .catch((error) => console.error("Error fetching leads:", error));
  }, [dmsID]); 

  return (
    <Box sx={{ width: "100%", mr: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Leads
      </Typography>

      {leads.length > 0 ? (
        leads.map((lead) => (
          <React.Fragment key={lead.id}>
            <Typography>{`Leads: ${lead.leadNumber}`}</Typography>
            <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
          </React.Fragment>
        ))
      ) : (
        <Typography>No leads found for the specified DMS ID.</Typography>
      )}
    </Box>
  );
};

export default ContactLead;