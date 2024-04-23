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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { removeVehicleFromLead } from "../../../hooks/RemoveVehicleFromLead";

const LeadVehicle = ({ vehicleId, leadId }) => {
  console.log("Lead ID in LeadVehicle:", leadId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

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
    if (!leadId) {
      console.error("Lead ID is undefined when opening the search dialog.");
      return;
    }
    setSearchDialogOpen(true);
  };

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
      setError("Failed to fetch vehicle: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadVehicle();
  }, [vehicleId]);

  const handleCloseSearchDialog = () => {
    setSearchDialogOpen(false);
  };

  const handlePrev = () =>
    setActiveImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : photos.length - 1
    );
  const handleNext = () =>
    setActiveImageIndex((prevIndex) =>
      prevIndex < photos.length - 1 ? prevIndex + 1 : 0
    );
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!vehicle)
    return (
      <>
        <Typography>No vehicle data available</Typography>
        <Button
          onClick={handleOpenSearchDialog}
          color="primary"
          variant="outlined"
        >
          Add Vehicle
        </Button>
        <Dialog
          open={searchDialogOpen}
          onClose={handleCloseSearchDialog}
          maxWidth="md"
        >
          <DialogTitle>Search Vehicles</DialogTitle>
          <DialogContent>
            <SearchComponent
              searchFields={searchFields}
              collectionPath="preOwnedVehicleInventory"
              resultFields={resultFields}
              leadId={leadId}
              onVehicleAdded={fetchLeadVehicle}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSearchDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );

  const photos = vehicle.photo ? vehicle.photo.split(",") : [];

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
                onClick={handleOpenDialog}
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

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <IconButton onClick={handlePrev}>
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography>{`${activeImageIndex + 1} of ${
                  photos.length
                }`}</Typography>
                <IconButton onClick={handleNext}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
            </Grid>





            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {[
                  ["Dealer", vehicle.dealer_name],
                  ["Stock #", vehicle.stock],
                  ["VIN", vehicle.vin],
                  ["Status", vehicle.status],
                  ["Body", vehicle.body],
                  ["Drive", vehicle.drive],
                  ["Transmission", vehicle.transmission],
                  ["Fuel", vehicle.fuel],
                  ["Engine", vehicle.eng_desc],
                  ["Exterior Color", vehicle.extcolour],
                  ["Interior Color", vehicle.intcolour],
                  ["Odometer", `${vehicle.odometer} km`],
                  ["Price", `$${vehicle.sale_price}`],
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <TextField
                      label={item[0]}
                      value={item[1]}
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
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        aria-labelledby="image-view-dialog"
      >
        <DialogContent>
          <img
            src={photos[activeImageIndex]}
            alt={`Vehicle Image ${activeImageIndex + 1}`}
            style={{
              width: "100%",
              maxHeight: "75vh",
              objectFit: "contain",
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <IconButton onClick={handlePrev}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography>{`${activeImageIndex + 1} of ${
              photos.length
            }`}</Typography>
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadVehicle;
