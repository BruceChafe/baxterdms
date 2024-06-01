import React, { useMemo } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const formatField = (field) => {
  switch (field.kind) {
    case "currency":
      return `${field.value.currencySymbol}${field.value.amount} (${field.value.currencyCode})`;
    case "date":
      return new Date(field.value).toLocaleDateString();
    case "address":
      return `${field.value.streetAddress}, ${field.value.city}, ${field.value.state}, ${field.value.postalCode}`;
    default:
      return field.value;
  }
};

const renderFields = (fields) => {
  return Object.entries(fields).map(([key, field]) => (
    <React.Fragment key={key}>
      <ListItem>
        <ListItemText primary={key} secondary={formatField(field)} />
      </ListItem>
      <Divider />
    </React.Fragment>
  ));
};

const LicenseDetail = ({ license, image }) => {
  const fieldElements = useMemo(() => {
    return license ? renderFields(license.analysisResult[0].fields) : null;
  }, [license]);

  if (!license) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" mb={2}>
          Select a license to view details
        </Typography>
        {image && (
          <div>
            <Typography variant="h6">Captured/Uploaded Image:</Typography>
            <img src={image} alt="Captured/Uploaded" style={{ width: "100%" }} />
          </div>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        License Details
      </Typography>
      {image && (
        <div>
          <Typography variant="h6">Captured/Uploaded Image:</Typography>
          <img src={image} alt="Captured/Uploaded" style={{ width: "100%" }} />
        </div>
      )}
      <List>
        <ListItem>
          <ListItemText primary="License Type" secondary={license.licenseType} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Upload Date" secondary={new Date(license.uploadDate).toLocaleString()} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Original URL"
            secondary={
              <a href={license.originalUrl} target="_blank" rel="noopener noreferrer">
                {license.originalUrl}
              </a>
            }
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Archived URL"
            secondary={
              <a href={license.archivedUrl} target="_blank" rel="noopener noreferrer">
                {license.archivedUrl}
              </a>
            }
          />
        </ListItem>
        <Divider />
        {fieldElements}
      </List>
    </Box>
  );
};

export default LicenseDetail;
