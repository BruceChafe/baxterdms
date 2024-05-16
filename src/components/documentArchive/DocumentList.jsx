import React, { useState, useEffect } from 'react';
import axios from "../../axios";
import { List, ListItem, ListItemText, Button, Typography, Box, Paper, Divider } from '@mui/material';
import { useSnackbar } from '../../context/SnackbarContext';

function DocumentList({ onSelectDocument }) {
  const [documents, setDocuments] = useState([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('/documents');
        console.log('Fetched documents:', response.data);
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
        showSnackbar('Error fetching documents', 'error');
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    console.log(`Attempting to delete document with id: ${id}`);
    try {
      await axios.delete(`/documents/${id}`);
      setDocuments(documents.filter((doc) => doc.documentId !== id));
      showSnackbar('Document deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting document:', error);
      showSnackbar('Error deleting document', 'error');
    }
  };

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
              <Button variant="outlined" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(doc.documentId); }}>
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

export default DocumentList;
