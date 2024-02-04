import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";

const LeadComponent = () => {
  const [lead, setLead] = useState(null);
  const { leadId } = useParams();

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const fetchLead = () => {
    fetch(`http://localhost:8000/leads/${leadId}`)
      .then((res) => res.json())
      .then((data) => {
        setLead(data);
      })
      .catch((error) => {
        console.error("Error fetching lead:", error);
      });
  };

  return (
    <div>
      {lead ? (
        <Typography>
          Lead Details for leadId: {leadId}
          {lead.leadDealership}
        </Typography>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </div>
  );
};

export default LeadComponent;
