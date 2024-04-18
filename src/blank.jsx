import React, { useState } from "react";
import { db } from "../../firebase"; // Adjust path as necessary
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  Box,
  TextField,
  Typography,
  Button,
  TablePagination,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import NewLeadForm from "./NewLeadForm";
import BasicTable from "../tables/BasicTable";
import NewContact from "../contacts/NewContact";

const NewLeadComponent = () => {
  const [searchData, setSearchData] = useState({
    firstName: "",
    lastName: "",
    primaryEmail: "",
    mobilePhone: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [contactIdForNewLead, setContactIdForNewLead] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showNewContactForm, setShowNewContactForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    try {
      const contactRef = collection(db, "contacts");
      let contactQuery = query(contactRef);

      Object.entries(searchData).forEach(([key, value]) => {
        if (value.trim() !== "") {
          contactQuery = query(contactQuery, where(key, "==", value.trim()));
        }
      });

      const querySnapshot = await getDocs(contactQuery);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSearchResults(results);
      setTotalCount(results.length);
      setNoResults(results.length === 0);
    } catch (error) {
      console.error("Error searching contacts:", error);
      setNoResults(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNewLeadClick = (contactId) => {
    setContactIdForNewLead(contactId);
    setShowNewLeadForm(true);
  };

  const handleNewContactClick = () => {
    setShowNewContactForm(true);
  };

  const handleNewContactCreated = (newContactId) => {
    setContactIdForNewLead(newContactId);
    setShowNewContactForm(false);
    setShowNewLeadForm(true);
  };

  const handleCloseForm = () => {
    setShowNewLeadForm(false);
    setShowNewContactForm(false);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      {!showNewLeadForm && !showNewContactForm && (
        <>
          <Typography variant="h4" mb={2}>New Lead</Typography>
          <Divider />
          <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <Typography variant="h5" mb={2}>Search Existing Contacts</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    onChange={handleInputChange}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    variant="outlined"
                    mb={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    onChange={handleInputChange}
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    variant="outlined"
                    mb={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    onChange={handleInputChange}
                    fullWidth
                    label="Email"
                    name="primaryEmail"
                    variant="outlined"
                    mb={2}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    onChange={handleInputChange}
                    fullWidth
                    label="Phone Number"
                    name="mobilePhone"
                    variant="outlined"
                    mb={2}
                  />
                </Grid>
              </Grid>
              <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>Search</Button>
            </Box>
          </Paper>
          <Divider />
          {noResults ? (
            <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
              <Typography>No results found. Consider adding a new contact.</Typography>
              <Button variant="contained" onClick={handleNewContactClick} sx={{ mt: 2 }}>New Contact</Button>
            </Paper>
          ) : (
            <BasicTable
              data={searchResults}
              columns={[
                { field: "firstName", header: "First Name" },
                { field: "lastName", header: "Last Name" },
                { field: "primaryEmail", header: "Email" },
                { field: "mobilePhone", header: "Phone" },
              ]}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page}
              rowsPerPage={rowsPerPage}
              totalCount={totalCount}
              onRowClick={handleNewLeadClick}
              actionLabel="Create Lead"
            />
          )}
        </>
      )}
      {showNewLeadForm && (
        <NewLeadForm onCloseForm={handleCloseForm} contactId={contactIdForNewLead} />
      )}
      {showNewContactForm && (
        <NewContact onCloseForm={handleCloseForm} onNewContactCreated={handleNewContactCreated} />
      )}
    </Box>
  );
};

export default NewLeadComponent;
