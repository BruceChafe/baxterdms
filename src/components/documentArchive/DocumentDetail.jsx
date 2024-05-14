import React from 'react';
import { Typography, Box, Card, List, ListItem, ListItemText, Divider } from '@mui/material';

function DocumentDetail({ document }) {
  if (!document) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Select a document to view details</Typography>
      </Box>
    );
  }

  const renderFields = (fields) => {
    return Object.entries(fields).map(([key, field]) => {
      let value;
      switch (field.kind) {
        case 'currency':
          value = `${field.value.currencySymbol}${field.value.amount} (${field.value.currencyCode})`;
          break;
        case 'date':
          value = new Date(field.value).toLocaleDateString();
          break;
        case 'address':
          value = `${field.value.streetAddress}, ${field.value.city}, ${field.value.state}, ${field.value.postalCode}`;
          break;
        default:
          value = field.value;
          break;
      }

      return (
        <React.Fragment key={key}>
          <ListItem>
            <ListItemText primary={key} secondary={value} />
          </ListItem>
          <Divider />
        </React.Fragment>
      );
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      
        <Typography variant="h6" gutterBottom>
          Document Details
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Document Type" secondary={document.documentType} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Upload Date" secondary={new Date(document.uploadDate).toLocaleString()} />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Original URL"
              secondary={
                <a href={document.originalUrl} target="_blank" rel="noopener noreferrer">
                  {document.originalUrl}
                </a>
              }
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Archived URL"
              secondary={
                <a href={document.archivedUrl} target="_blank" rel="noopener noreferrer">
                  {document.archivedUrl}
                </a>
              }
            />
          </ListItem>
          <Divider />
          {renderFields(document.analysisResult[0].fields)}
        </List>
    </Box>
  );
}

export default DocumentDetail;
