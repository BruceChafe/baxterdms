import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import TitleLayout from "../layouts/TitleLayout";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Inventory = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const { inventoryId } = useParams();
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/inventory/${inventoryId}`
        );
        if (!response.ok) throw new Error("Failed to fetch inventory data");
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        setSnackbarMessage(error.message);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryData();
  }, [inventoryId]);

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
  if (!inventory) return <Typography>No inventory found</Typography>;

  const detailsColumns = [
    [
      ["Dealer", inventory.dealer_name],
      ["Stock #", inventory.stock],
      ["VIN", inventory.vin],
      ["Status", inventory.status],
    ],
    [
      ["Body", inventory.body],
      ["Drive", inventory.drive],
      ["Transmission", inventory.transmission],
      ["Fuel", inventory.fuel],
    ],
    [
      ["Engine", inventory.eng_desc],
      ["Exterior Color", inventory.extcolour],
      ["Interior Color", inventory.intcolour],
      ["Odometer", `${inventory.odometer} km`],
      ["Price", `$${inventory.sale_price}`],
    ],
  ];

  const photos = inventory.photo.split(",");

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      {inventory ? (
        <>
          <TitleLayout
            title={
              <Typography variant="h4">{inventory.dealer_name}</Typography>
            }
          />
          <Box mt={2}>
          <Paper sx={{ p: 3, mb: 2 }}>
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
                {detailsColumns.map((column, columnIndex) => (
                  <Grid item xs={4} key={columnIndex}>
                    {column.map(([label, value], index) => (
                      <TextField
                        key={index}
                        label={label}
                        value={value || ""}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        InputProps={{ readOnly: true }}
                        disabled
                      />
                    ))}
                  </Grid>
                ))}
              </Grid>
            </Grid>
            </Grid>
            
          </Paper>
          </Box>
        </>
      ) : (
        <Typography>No inventory details available</Typography>
      )}
    </Box>
  );
};

export default Inventory;
