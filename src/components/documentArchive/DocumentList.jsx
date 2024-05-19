import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from "../../axios"; // Ensure this imports the configured axios instance
import { List, ListItem, ListItemText, Button, Typography, Box, Paper, Divider, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../context/SnackbarContext';

function DocumentList({ onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('/documents');
        console.log('Fetched documents:', response.data);

        if (Array.isArray(response.data)) {
          setDocuments(response.data);
        } else {
          console.error('Expected an array of documents but received:', response);
          showSnackbar('Error fetching documents: Invalid response format', 'error');
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
        showSnackbar('Error fetching documents', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [showSnackbar]);

  const handleDelete = useCallback(async (id) => {
    console.log(`Attempting to delete document with id: ${id}`);
    try {
      await axios.delete(`/documents/${id}`);
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.documentId !== id));
      showSnackbar('Document deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting document:', error);
      showSnackbar('Error deleting document', 'error');
    }
  }, [showSnackbar]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" mb={2}>
        Archived Documents
      </Typography>
      <List>
        {documents.map((doc) => (
          <Paper key={doc.documentId} sx={{ mb: 2 }}>
            <ListItem button onClick={() => onSelectDocument(doc)}>
              <ListItemText primary={doc.documentType} secondary={new Date(doc.uploadDate).toLocaleString()} />
              <Button
                variant="outlined"
                color="error"
                onClick={(e) => { e.stopPropagation(); handleDelete(doc.documentId); }}
              >
                Delete
              </Button>
            </ListItem>
            <Divider />
          </Paper>
        ))}
      </List>
    </Box>
  );
}

DocumentList.propTypes = {
  onSelectDocument: PropTypes.func.isRequired,
};

export default DocumentList;
