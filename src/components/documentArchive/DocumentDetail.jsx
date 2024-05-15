import React from "react";
import { Typography, Box, List, ListItem, ListItemText, Divider, Link } from "@mui/material";

function DocumentDetail({ document }) {
  if (!document) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" mb={2}>
          Select a document to view details
        </Typography>
      </Box>
    );
  }

  const renderFields = (fields) => {
    return Object.entries(fields).map(([key, field]) => {
      let value;
      switch (field.kind) {
        case "currency":
          value = `${field.value.currencySymbol}${field.value.amount} (${field.value.currencyCode})`;
          break;
        case "date":
          value = new Date(field.value).toLocaleDateString();
          break;
        case "address":
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
          <ListItemText
            primary="Document Type"
            secondary={document.documentType}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Upload Date"
            secondary={new Date(document.uploadDate).toLocaleString()}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Original URL"
            secondary={
              <Link href={document.originalUrl} target="_blank" rel="noopener noreferrer">
                {document.originalUrl}
              </Link>
            }
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Archived URL"
            secondary={
              <Link href={document.archivedUrl} target="_blank" rel="noopener noreferrer">
                {document.archivedUrl}
              </Link>
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
