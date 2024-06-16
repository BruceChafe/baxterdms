import React, { useState, useEffect } from "react";
import { Typography, Box, CircularProgress, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios";
import LicenseScannerDetail from "../LicenseScannerDetail";
import TitleLayout from "../../layouts/TitleLayout";
import TabbedLayout from "../../layouts/TabbedLayout";
import LeadProfileBasicInfo from "./LicenseProfileBasics";
import LeadProfilePhysical from "./LicenseProfilePhysical"

const VisitorProfile = () => {
  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/documents/${documentId}`);
        if (response.headers["content-type"].includes("application/json")) {
          setDocument(response.data);
          setError(null); // Clear any previous errors
        } else {
          throw new Error("Received non-JSON response from server");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout title={<Typography variant="h4">Visitor Profile</Typography>} />
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress color="primary" />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Fetching data, please wait...
          </Typography>
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      ) : document ? (
        <TabbedLayout
          tabs={[
            {
              label: "Basic Info",
              // component: () => <LeadProfileBasicInfo lead={document} onSaveLeadInfo={() => {}} onInfoChange={() => {}} isEditable={false} />,
              component: () => <LeadProfileBasicInfo document={document} />,
            },
            {
              label: "Visitor Overview",
              component: () => <LeadProfilePhysical document={document} />,
            },
          ]}
        />
      ) : (
        <Typography variant="h6">No document found</Typography>
      )}
    </Box>
  );
};

export default VisitorProfile;
