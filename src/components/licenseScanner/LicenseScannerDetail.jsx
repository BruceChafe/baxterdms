import React, { useMemo } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from "@mui/material";

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

const FieldItem = ({ fieldKey, field }) => (
  <React.Fragment key={fieldKey}>
    <ListItem>
      <ListItemText primary={fieldKey} secondary={formatField(field)} />
    </ListItem>
    <Divider />
  </React.Fragment>
);

const renderFields = (fields) => {
  return Object.keys(fields).map((key) => (
    <FieldItem key={key} fieldKey={key} field={fields[key]} />
  ));
};

const LicenseScannerDetail = ({ document }) => {
  const fieldElements = useMemo(() => {
    if (!document) return null;
    const fields = document.extractedData || {};
    return renderFields(fields);
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
    <Box sx={{ padding: 2, maxHeight: "80vh", overflow: "auto" }}>
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
            primary="Archived URL"
            secondary={
              <Link
                href={document.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                {document.archiveUrl}
              </Link>
            }
          />
        </ListItem>
        <Divider />
        {fieldElements}
      </List>
      {document.archiveUrl && (
        <Box
          component="img"
          sx={{
            width: '100%',
            maxHeight: '500px',
            objectFit: 'contain',
            mt: 2,
          }}
          src={document.archiveUrl}
          alt="Archived Document"
        />
      )}
    </Box>
  );
};

export default LicenseScannerDetail;
