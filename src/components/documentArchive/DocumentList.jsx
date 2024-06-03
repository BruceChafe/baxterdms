import React, { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "../../axios";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  TextField,
  Collapse,
  Typography
} from "@mui/material";
import { useSnackbar } from '../../context/SnackbarContext';
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const DocumentList = ({ onSelectDocument, open, onToggle }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);
  const { showSnackbar } = useSnackbar();

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      showSnackbar(`Error fetching documents: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = useCallback(async (document, event) => {
    event.stopPropagation();
    const { documentId, archiveUrl } = document;
    console.log(`Attempting to delete document with documentId: ${documentId}`);
    setDeleting(documentId);

    try {
      await axiosInstance.delete(`/documents/${documentId}`, {
        data: { archiveUrl }
      });
      setDocuments((prevDocuments) => prevDocuments.filter((doc) => doc.documentId !== documentId));
      showSnackbar(`Document deleted successfully.`, "success");
    } catch (error) {
      console.error('Error deleting document:', error);
      showSnackbar(`Error deleting document: ${error.message}`, "error");
    } finally {
      setDeleting(null);
    }
  }, [showSnackbar]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  const DocumentItem = ({ doc }) => (
    <React.Fragment key={doc.documentId}>
      <ListItem button onClick={() => onSelectDocument(doc)}>
        <ListItemText
          primary={doc.filename}
          secondary={new Date(doc.uploadDate).toLocaleString()}
        />
        <Button
          variant="outlined"
          color="error"
          onClick={(event) => handleDelete(doc, event)}
          disabled={deleting === doc.documentId}
          sx={{ ml: 2 }}
        >
          {deleting === doc.documentId ? <CircularProgress size={24} /> : "Delete"}
        </Button>
      </ListItem>
      <Divider />
    </React.Fragment>
  );

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={onToggle}>
        <Typography variant="h5" mb={2}>
          Search Documents
        </Typography>
        {open ? <ExpandLess /> : <ExpandMore />}
      </Box>
      <Collapse in={open}>
        <TextField
          label="Search Documents"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress />
          </Box>
        ) : filteredDocuments.length === 0 ? (
          <Alert severity="info">No documents available.</Alert>
        ) : (
          <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
            <List>
              {filteredDocuments.map(doc => (
                <DocumentItem doc={doc} key={doc.documentId} />
              ))}
            </List>
          </Box>
        )}
      </Collapse>
    </Box>
  );
};

export default DocumentList;
