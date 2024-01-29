import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";

const ContactVehicle = ({ dmsID }) => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/vehicles?dmsID=${dmsID}`)
      .then((response) => response.json())
      .then((data) => setVehicles(data || []))
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, [dmsID]); 

  return (
    <Box sx={{ width: "100%", mr: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Vehicles
      </Typography>

      {vehicles.length > 0 ? (
        vehicles.map((vehicle) => (
          <React.Fragment key={vehicle.id}>
            <Typography>{`VIN: ${vehicle.vin}`}</Typography>
            <Typography>{`Year: ${vehicle.modelYear}`}</Typography>
            <Typography>{`Make: ${vehicle.modelMake}`}</Typography>
            <Typography>{`Model: ${vehicle.modelModel}`}</Typography>
            <Typography>{`Colour: ${vehicle.modelColor}`}</Typography>
            <Typography>{`Kilometers: ${vehicle.kms}`}</Typography>
            <Divider sx={{ mt: 1, mb: 1, width: 1 / 2 }} />
          </React.Fragment>
        ))
      ) : (
        <Typography>No vehicles found for the specified DMS ID.</Typography>
      )}
    </Box>
  );
};

export default ContactVehicle;
