import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../axios";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useSnackbar } from '../../context/SnackbarContext';

const LicenseList = ({ onSelectLicense }) => {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { showSnackbar } = useSnackbar();

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/licenses");
      console.log("Fetched licenses:", response.data);
      setLicenses(response.data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      showSnackbar(`Error fetching licenses: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const handleDelete = useCallback(async (license, event) => {
    event.stopPropagation();
    const { licenseId, originalUrl, archivedUrl } = license;
    console.log(`Attempting to delete license with licenseId: ${licenseId}`);
    setDeleting(licenseId);

    try {
      const deleteResponse = await axiosInstance.delete(`/licenses/${licenseId}`, {
        data: { originalUrl, archivedUrl }
      });

      console.log(`Delete response: ${JSON.stringify(deleteResponse.data)}`);

      setLicenses(licenses.filter((lic) => lic.licenseId !== licenseId));
      showSnackbar(`License deleted successfully.`, "success");
    } catch (error) {
      console.error('Error deleting license:', error);
      showSnackbar(`Error deleting license: ${error.message}`, "error");
    } finally {
      setDeleting(null);
    }
  }, [licenses, showSnackbar]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Archived Licenses
      </Typography>
      {licenses.length === 0 ? (
        <Alert severity="info">No licenses available.</Alert>
      ) : (
        <List>
          {licenses.map((lic) => (
            <React.Fragment key={lic.licenseId}>
              <ListItem button onClick={() => onSelectLicense(lic)}>
                <ListItemText
                  primary={lic.licenseType}
                  secondary={new Date(lic.uploadDate).toLocaleString()}
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={(event) => handleDelete(lic, event)}
                  disabled={deleting === lic.licenseId}
                  sx={{ ml: 2 }}
                >
                  {deleting === lic.licenseId ? <CircularProgress size={24} /> : "Delete"}
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default LicenseList;
