import React, { useState } from "react";
import { Typography, Box, Paper, Button, Grid } from "@mui/material";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import SearchAndAddVehicleDialog from "../vehicles/SearchAndAddVehicleDialog";
import VehicleDetails from "../vehicles/VehicleDetails";
import VehicleImageGallery from "../vehicles/VehicleImageGallery";
import { useSnackbar } from "../../context/SnackbarContext";

const LeadVehicle = ({
  vehicleId,
  vehicle,
  leadId,
  onVehicleRemoved,
  onVehicleAdded,
}) => {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleDeleteLeadVehicle = async (vehicle) => {
    if (!vehicle) return;
    const leadRef = doc(db, "leads", leadId);
    try {
      await updateDoc(leadRef, {
        vehicleIDs: arrayRemove(vehicle.id),
      });
      onVehicleRemoved();
      showSnackbar("Vehicle removed successfully.", "success");
    } catch (error) {
      console.error("Error removing vehicle:", error);
      showSnackbar(`Failed to remove vehicle: ${error.message}`, "error");
    }
  };

  const handleAddVehicleToLead = async (vehicleId) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, {
        vehicleIDs: arrayUnion(vehicleId),
      });
      console.log("Vehicle added successfully");
      onVehicleAdded();
      showSnackbar("Vehicle added successfully.", "success");
    } catch (error) {
      console.error("Error adding vehicle:", error);
      showSnackbar(`Failed to add vehicle: ${error.message}`, "error");
    }
  };

  const handleCloseDialog = () => {
    setSearchDialogOpen(false);
  };

  console.log(vehicle);

  const vehicleArray = Array.isArray(vehicle) ? vehicle : [vehicle];

  if (!vehicle || vehicleArray.length === 0) {
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
          onVehicleAdded={handleAddVehicleToLead}
        />
      </>
    );
  }

  return (
    <>
      {vehicleArray.map((v, index) => (
        <Box key={index} sx={{ mb: 5 }}>
          <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Grid item xs={12} sm>
                <Typography variant="h5">
                  {v.year} {v.make} {v.model}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => handleDeleteLeadVehicle(v)}
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
                  photos={v.photo ? v.photo.split(",") : []}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <VehicleDetails vehicle={v} />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      ))}
    </>
  );
};

export default LeadVehicle;
