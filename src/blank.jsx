import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import SearchComponent from "../../../hooks/search/SearchComponent";
import TitleLayout from "../layouts/TitleLayout";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { removeVehicleFromLead } from "../../../hooks/RemoveVehicleFromLead";

const LeadVehicle = ({ vehicleId, leadId }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const searchFields = [
    { name: "make", label: "Make" },
    { name: "model", label: "Model" },
    { name: "vin", label: "VIN" },
  ];

  const resultFields = [
    "make",
    "model",
    "year",
    "vin",
    "dealer_name",
    "sale_price",
  ];

  useEffect(() => {
    if (vehicleId) {
      const fetchLeadVehicle = async () => {
        setLoading(true);
        try {
          const vehicleRef = doc(db, "preOwnedVehicleInventory", vehicleId);
          const docSnap = await getDoc(vehicleRef);
          if (docSnap.exists()) {
            setVehicle({ id: docSnap.id, ...docSnap.data() });
          } else {
            setError("No such vehicle found!");
          }
        } catch (err) {
          setError("Failed to fetch vehicle: " + err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchLeadVehicle();
    }
  }, [vehicleId]);

  const handleDeleteLeadVehicle = async () => {
    if (!vehicle) return;
    const leadRef = doc(db, "leads", leadId);
    try {
      await updateDoc(leadRef, {
        vehicleIDs: arrayRemove(vehicle.id),
      });
      setSnackbarMessage("Vehicle removed successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error removing vehicle from lead:", error);
      setSnackbarMessage("Failed to remove vehicle.");
      setSnackbarOpen(true);
    }
  };

  const handleOpenSearchDialog = () => {
    setSearchDialogOpen(true);
  };

  const handleCloseSearchDialog = () => {
    setSearchDialogOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const photos = vehicle?.photo ? vehicle.photo.split(",") : [];

  return (
    <Box sx={{ mb: 5 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h5" mb={2}>
          {vehicle && `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        </Typography>
        <Button onClick={handleDeleteLeadVehicle} color="primary">
          Remove Vehicle
        </Button>
        <Button onClick={handleOpenSearchDialog} color="primary">
          Search Vehicles
        </Button>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "auto",
                border: "1px solid #ccc",
                borderRadius: "4px",
                overflow: "hidden",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() =>
                setActiveImageIndex(
                  (prevIndex) => (prevIndex + 1) % photos.length
                )
              }
            >
              <img
                src={
                  photos.length > 0
                    ? photos[activeImageIndex]
                    : "path/to/default/image.jpg"
                }
                alt={`Vehicle Image ${activeImageIndex + 1}`}
                style={{ width: "100%", height: "auto" }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              {resultFields.map((field, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <TextField
                    label={field}
                    value={vehicle ? vehicle[field] : ''}
                    variant="outlined"
                    fullWidth
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog open={searchDialogOpen} onClose={handleCloseSearchDialog}>
        <DialogTitle>Search Vehicles</DialogTitle>
        <DialogContent>
          <SearchComponent
            searchFields={searchFields}
            collectionPath="preOwnedVehicleInventory"
            resultFields={resultFields}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSearchDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadVehicle;
