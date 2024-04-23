import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Snackbar,
  Button,
  Grid,
} from "@mui/material";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";
import SearchAndAddVehicleDialog from "../vehicles/SearchAndAddVehicleDialog";
import VehicleDetails from "../vehicles/VehicleDetails";
import VehicleImageGallery from "../vehicles/VehicleImageGallery";

const LeadVehicle = ({ vehicleId, leadId }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchLeadVehicle = async () => {
    if (!vehicleId) return;
    setLoading(true);
    setError("");
    try {
      const vehicleRef = doc(db, "preOwnedVehicleInventory", vehicleId);
      const docSnap = await getDoc(vehicleRef);
      if (docSnap.exists()) {
        setVehicle({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("No such vehicle found!");
      }
    } catch (err) {
      setError(`Failed to fetch vehicle: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeadVehicle = async () => {
    if (!vehicle) return;
    const leadRef = doc(db, "leads", leadId);
    try {
      await updateDoc(leadRef, {
        vehicleIDs: arrayRemove(vehicle.id),
      });
      setVehicle(null);
      setSnackbarMessage("Vehicle removed successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Failed to remove vehicle.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setSearchDialogOpen(false);
  };

  useEffect(() => {
    fetchLeadVehicle();
  }, [vehicleId, refreshKey]);  

  const handleVehicleAdded = (newVehicleId) => {
    setVehicleId(newVehicleId);
    setRefreshKey(prevKey => prevKey + 1); // increment key to trigger refetch
  };
  
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!vehicle)
    return (
      <>
        <Typography>No vehicle data available</Typography>
        <Button
          onClick={() => setSearchDialogOpen(true)}
          color="primary"
          variant="outlined"
        >
          Add Vehicle
        </Button>
        <SearchAndAddVehicleDialog
          open={searchDialogOpen}
          onClose={handleCloseDialog}
          leadId={leadId}
          onVehicleAdded={fetchLeadVehicle} 
        />
      </>
    );

  return (
    <>
      <Box sx={{ mb: 5 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Grid item xs={12} sm>
              <Typography variant="h5">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                onClick={handleDeleteLeadVehicle}
                color="primary"
                variant="outlined"
              >
                Remove Vehicle
              </Button>
            </Grid>
          </Grid>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <VehicleImageGallery
                photos={vehicle.photo ? vehicle.photo.split(",") : []}
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <VehicleDetails vehicle={vehicle} />
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
      </Box>
    </>
  );
};

export default LeadVehicle;
