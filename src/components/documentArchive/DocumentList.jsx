import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from "../../axios"; // Ensure this imports the configured axios instance
import { List, ListItem, ListItemText, Button, Typography, Box, Paper, Divider, CircularProgress } from '@mui/material';
import { useSnackbar } from '../../context/SnackbarContext';

const DocumentList = ({ onSelectDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/documents');
        console.log('Fetched documents:', response.data);
        setDocuments(response.data);
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
      await axios.delete(`http://localhost:3001/documents/${id}`);
      setDocuments(documents.filter((doc) => doc.documentId !== id));
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
      <Typography variant="h6" gutterBottom>
        Archived Documents
      </Typography>
      <List>
        {documents.map((doc) => (
          <ListItem button key={doc.documentId} onClick={() => onSelectDocument(doc)}>
            <ListItemText primary={doc.documentType} secondary={new Date(doc.uploadDate).toLocaleString()} />
            <Button
              variant="outlined"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(doc.documentId);
              }}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

DocumentList.propTypes = {
  onSelectDocument: PropTypes.func.isRequired,
};

export default DocumentList;
