import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Alert,
  Grid,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Avatar,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useFetchLeadVehicle } from "../../hooks/FetchLeadVehicle";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

const LeadVehicle = ({ leadData }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const leadStockNumber = leadData?.stock;
  const {
    vehicle,
    loading: vehicleLoading,
    error: vehicleError,
  } = useFetchLeadVehicle(leadStockNumber);

  if (vehicleLoading) return <CircularProgress />;
  if (vehicleError) return <Alert severity="error">{vehicleError}</Alert>;

  const photos = vehicle[0].photo.split(",");

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

  const options = vehicle?.[0].option.split(",");

  const chunkedOptions = [];
  for (let i = 0; i < options.length; i += 25) {
    chunkedOptions.push(options.slice(i, i + 25));
  }

  const detailsColumns = [
    [
      ["Dealer", vehicle[0].dealer_name],
      ["Stock #", vehicle[0].stock],
      ["VIN", vehicle[0].vin],
      ["Status", vehicle[0].status],
    ],
    [
      ["Body", vehicle[0].body],
      ["Drive", vehicle[0].drive],
      ["Transmission", vehicle[0].transmission],
      ["Fuel", vehicle[0].fuel],
    ],
    [
      ["Engine", vehicle[0].eng_desc],
      ["Exterior Color", vehicle[0].extcolour],
      ["Interior Color", vehicle[0].intcolour],
      ["Odometer", `${vehicle[0].odometer} km`],
      ["Price", `$${vehicle[0].sale_price}`],
    ],
  ];

  const handleDelete = (vehicleId) => {};
  const handleAdd = () => {};

  return (
    <>
      <Paper sx={{ p: 3, mb: 2 }}>
        {vehicle && (
          <>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {`${vehicle[0].year} ${vehicle[0].make} ${vehicle[0].model} - ${vehicle[0].trim}`}
              <Tooltip title="Remove Vehicle From Lead">
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(vehicle[0].id)}
                >
                  <ClearIcon color="primary"/>
                </IconButton>
              </Tooltip>
            </Typography>

            <Divider sx={{ mb: 2 }} />
            <Box mt={2}>
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
                    }}
                    onClick={handleOpenDialog}
                  >
                    <img
                      src={photos[activeImageIndex]}
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
                    {detailsColumns.flat().map(([label, value], idx) => (
                      <Grid item xs={4} key={idx}>
                        <TextField
                          key={idx}
                          label={label}
                          value={value}
                          variant="standard"
                          fullWidth
                          margin="dense"
                          InputProps={{ readOnly: true }}
                          disabled
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
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
        )}
      </Paper>
      <Tooltip title="Add Vehicle To Lead">
        <IconButton onClick={() => handleDelete(vehicle[0].id)}>
          <AddIcon color="primary" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default LeadVehicle;
