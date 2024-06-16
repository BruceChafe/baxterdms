import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const LicenseScannerDetail = ({ document }) => {
  console.log(document);

  if (!document) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" mb={2}>
          Select a document to view details
        </Typography>
      </Box>
    );
  }

  const {
    id,
    archiveUrl,
    analysisResult: {
      fields: {
        FirstName: { value: firstName } = {},
        LastName: { value: lastName } = {},
        DocumentNumber: { content: documentNumber } = {},
        DateOfBirth: { value: dateOfBirth } = {},
        DateOfExpiration: { value: dateOfExpiration } = {},
        Sex: { value: sex } = {},
        Address: { content: address } = {},
        CountryRegion: { value: country } = {},
        DateOfIssue: { content: issueDate } = {},
        DocumentDiscriminator: { content: discriminator } = {},
        Endorsements: { content: endorsements } = {},
        EyeColor: { content: eyeColor } = {},
        HairColor: { content: hairColor } = {},
        Region: { content: region } = {},
        Restrictions: { content: restrictions } = {},
        VehicleClassifications: { content: vehicleClass } = {},
      } = {},
    } = {},
  } = document;


  return (
    <Box sx={{ padding: 1, maxHeight: "80vh", overflow: "auto" }}>
      <Typography variant="subtitle1" gutterBottom>
      {firstName} {lastName}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={archiveUrl}
              alt="Archived Document"
            />
            <CardContent>
              <Chip
                avatar={<Avatar><CheckCircle /></Avatar>}
                label="PASSED"
                color="success"
                sx={{ width: '100%' }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Sex:</strong> {sex}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Exp Date:</strong> {new Date(dateOfExpiration).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Country:</strong> {country}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Restrictions:</strong> {restrictions}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Vehicle Class:</strong> {vehicleClass}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Address:</strong> {address}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LicenseScannerDetail;
