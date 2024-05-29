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

const DocumentDetail = ({ document }) => {
  const fieldElements = useMemo(() => {
    return document ? renderFields(document.analysisResult[0].fields) : null;
  }, [document]);

  if (!document) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" mb={2}>
          Select a document to view details
        </Typography>
      </Box>
    );
  }

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
        {fieldElements}
      </List>
    </Box>
  );
};

export default DocumentDetail;
