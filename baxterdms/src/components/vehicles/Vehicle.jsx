import React, { useState } from "react";
import { Paper, IconButton, Box, Grid, Tab, Tabs } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Vehicle = ({ vehicle, showPanel, onClose, navigationLinks }) => {
  const [value, setValue] = useState();

  const handleNavigationLinkClick = (selectedTab) => {
    setValue(selectedTab);
  };

  if (!vehicle) {
    return null;
  }

  return (
    <>
      {showPanel && (
        <Paper
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            width: "90%",
            height: "90vh",
            zIndex: 9999,
          }}
        >
          <IconButton
            aria-label="close"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 9999,
            }}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>

          <Grid container>
            <Grid item xs={2}>
            </Grid>

            <Grid item xs={10}>
              <Box sx={{ marginLeft: "10px" }}>
                <p>{`Vehicle: ${vehicle.modelModel}`}</p>
                <p>{`Vehicle: ${vehicle.vin}`}</p>

              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

export default Vehicle;
