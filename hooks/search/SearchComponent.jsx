import React, { useState, useContext } from "react";
import { db } from "../../src/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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
} from "@mui/material";

const SearchComponent = ({
  searchFields,
  collectionPath,
  resultFields,
  onVehicleAdded,
}) => {
  const [searchData, setSearchData] = useState(
    searchFields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const conditions = Object.entries(searchData)
        .filter(([, value]) => value.trim() !== "")
        .map(([key, value]) => where(key, "==", value.trim()));

      const contactQuery = query(collection(db, collectionPath), ...conditions);
      const querySnapshot = await getDocs(contactQuery);
      setSearchResults(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      );
    } catch (error) {
      console.error("Error searching:", error);
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
                {resultFields.map((field) => (
                  <TableCell align="center" key={field}>
                    {field}
                  </TableCell>
                ))}
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchResults.map((row) => (
                <TableRow key={row.id}>
                  {resultFields.map((field) => (
                    <TableCell align="center" key={field}>
                      {row[field]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Button
                      onClick={() => onVehicleAdded(row.id)}
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
    </Box>
  );
};

export default SearchComponent;
