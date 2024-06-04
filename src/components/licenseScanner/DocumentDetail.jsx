import React, { useState, useMemo } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

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

const FieldItem = ({ fieldKey, field }) => (
  <React.Fragment key={fieldKey}>
    <ListItem>
      <ListItemText primary={fieldKey} secondary={formatField(field)} />
    </ListItem>
    <Divider />
  </React.Fragment>
);

const renderFields = (fields) => {
  return Object.entries(fields).map(([key, field]) => (
    <FieldItem key={key} fieldKey={key} field={field} />
  ));
};

const DocumentDetail = ({ document }) => {
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const fieldElements = useMemo(() => {
    if (!document) return null;
    const fields = document.analysisResult?.[0]?.fields || {};
    return renderFields(fields);
  }, [document]);

  const handleClickOpen = (url) => {
    setPdfUrl(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPdfUrl(null);
  };

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
            primary="Original URL"
            secondary={
              <Link
                href="#"
                onClick={() => handleClickOpen(document.originalUrl)}
                underline="hover"
              >
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
              <Link
                href="#"
                onClick={() => handleClickOpen(document.archiveUrl)}
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>
          PDF Viewer
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {pdfUrl && (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DocumentDetail;
