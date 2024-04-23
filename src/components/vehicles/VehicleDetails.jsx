import React from "react";
import {
  Grid,
  TextField,
} from "@mui/material";

const VehicleDetails = ({ vehicle }) => {
    const details = [
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
    ];
  
    return (
      <Grid container spacing={2}>
        {details.map((item, index) => (
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
    );
  };
  
  export default VehicleDetails;