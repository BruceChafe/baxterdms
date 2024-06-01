import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../axios";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  TextField
} from "@mui/material";
import { useSnackbar } from '../../context/SnackbarContext';

const DocumentList = ({ onSelectDocument }) => {
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
      console.log(documents)
    } catch (error) {
      console.error("Error fetching documents:", error);
      showSnackbar(`Error fetching documents: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, showSnackbar]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = useCallback(async (document, event) => {
    event.stopPropagation();
    const { documentId, originalUrl, archivedUrl } = document;
    console.log(`Attempting to delete document with documentId: ${documentId}`);
    setDeleting(documentId);

    try {
      const deleteResponse = await axiosInstance.delete(`/documents/${documentId}`, {
        data: { originalUrl, archivedUrl }
      });

      console.log(`Delete response: ${JSON.stringify(deleteResponse.data)}`);

      setDocuments(documents.filter((doc) => doc.documentId !== documentId));
      showSnackbar(`Document deleted successfully.`, "success");
    } catch (error) {
      console.error('Error deleting document:', error);
      showSnackbar(`Error deleting document: ${error.message}`, "error");
    } finally {
      setDeleting(null);
    }
  }, [documents, showSnackbar]);

  return (
    <Box sx={{ padding: 2 }}>
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
      ) : documents.length === 0 ? (
        <Alert severity="info">No documents available.</Alert>
      ) : (
        <List>
          {documents.map((doc) => (
            <React.Fragment key={doc.documentId}>
              <ListItem button onClick={() => onSelectDocument(doc)}>
                <ListItemText
                  primary={doc.filename} // Display the filename here
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
          ))}
        </List>
      )}
    </Box> 
  );
};

export default DocumentList;