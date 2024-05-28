import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';

function DocumentList({ onSelectDocument }) {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axiosInstance.get('/documents');
        console.log('Fetched documents:', response.data); // Add logging here
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    console.log(`Attempting to delete document with id: ${id}`);
    try {
      await axiosInstance.delete(`/documents/${id}`);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Archived Documents
      </Typography>
      <List>
        {documents.map((doc) => (
          <ListItem button key={doc.id} onClick={() => onSelectDocument(doc)}>
            <ListItemText primary={doc.documentType} secondary={new Date(doc.uploadDate).toLocaleString()} />
            <Button variant="outlined" color="error" onClick={() => handleDelete(doc.id)}>
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default DocumentList;
