import React, { useState, useEffect } from 'react';
import { db } from '../../src/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  Box,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

const SearchComponent = ({ searchFields, collectionPath, resultFields, leadId, onVehicleAdded }) => {
  const [searchData, setSearchData] = useState(
    searchFields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
  );
  const [searchResults, setSearchResults] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    console.log("Received leadId in SearchComponent:", leadId);
    if (!leadId) {
      console.error("leadId is undefined");
    }
  }, [leadId]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const conditions = Object.entries(searchData)
        .filter(([_, value]) => value.trim() !== "")
        .map(([key, value]) => where(key, "==", value.trim()));
      console.log("Search conditions:", conditions); // Log search conditions

      const contactQuery = query(collection(db, collectionPath), ...conditions);
      const querySnapshot = await getDocs(contactQuery);
      setSearchResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      console.log("Search results:", querySnapshot.docs.map(doc => doc.data())); // Log fetched data
    } catch (error) {
      console.error("Error searching:", error);
      setSnackbarMessage("Search failed: " + error.message);
      setSnackbarOpen(true);
    }
  };
  
  const handleAddVehicleToLead = async (vehicleId) => {
    if (!vehicleId || !leadId) return;
    const leadRef = doc(db, "leads", leadId);
    try {
      await updateDoc(leadRef, {
        vehicleIDs: arrayUnion(vehicleId),
      });
      onVehicleAdded();
      setSnackbarMessage("Vehicle added to lead successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding vehicle to lead:", error);
      setSnackbarMessage("Failed to add vehicle to lead.");
      setSnackbarOpen(true);
    }
  }; 

  return (
    <Box sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6">Search</Typography>
      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          {searchFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                value={searchData[field.name]}
                onChange={handleInputChange}
                variant="outlined"
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {searchResults.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {resultFields.map(field => (
                  <TableCell align="center" key={field}>{field}</TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map(row => (
                <TableRow key={row.id}>
                  {resultFields.map(field => (
                    <TableCell align="center" key={field}>
                      {row[field]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Button
                      onClick={() => handleAddVehicleToLead(row.id)}
                      color="primary"
                      variant="contained"
                    >
                      Add to Lead
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchComponent;
