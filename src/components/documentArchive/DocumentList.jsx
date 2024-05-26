import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';

const DocumentList = ({ onSelectDocument }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get('http://localhost:3001/documents');
        console.log('Fetched documents:', response.data);
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
      await axios.delete(`http://localhost:3001/documents/${id}`);
      setDocuments(documents.filter((doc) => doc.documentId !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
<<<<<<< HEAD
      <Typography variant="h6" gutterBottom>
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

export default DocumentList;
