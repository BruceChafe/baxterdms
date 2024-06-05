import React, { useMemo } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const formatField = (field) => {
  if (typeof field !== 'object' || !field) {
    return field;
  }

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

const renderFields = (words) => {
  return words.map((word, index) => (
    <React.Fragment key={index}>
      <ListItem>
        <ListItemText primary={word.content} secondary={`Confidence: ${word.confidence}`} />
      </ListItem>
      <Divider />
    </React.Fragment>
  ));
};

const LicenseDetail = ({ license }) => {
  const fieldElements = useMemo(() => {
    return license ? renderFields(license.analysisResult[0].words) : null;
    console.log(license)
  }, [license]);

  if (!license) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" mb={2}>
          Select a license to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        License Details
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Document ID" secondary={license.documentId} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Upload Date" secondary={new Date(license.uploadDate).toLocaleString()} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Document Type" secondary={license.documentType} />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Archived URL"
            secondary={
              <a href={license.archiveUrl} target="_blank" rel="noopener noreferrer">
                {license.archiveUrl}
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
