import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
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
  Divider,
} from "@mui/material";
import NewLeadForm from "./NewLeadForm";
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
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [contactIdForNewLead, setContactIdForNewLead] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showNewContactForm, setShowNewContactForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSearchPerformed(false);
  };

  const handleSearch = async () => {
    setSearchPerformed(true);
    try {
      const contactQuery = query(
        collection(db, "contacts"),
        ...Object.entries(searchData)
          .filter(([_, value]) => value.trim() !== "")
          .map(([key, value]) => where(key, "==", value.trim()))
      );

      const querySnapshot = await getDocs(contactQuery);
      setSearchResults(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setNoResults(querySnapshot.empty);
    } catch (error) {
      console.error("Error searching contacts:", error);
      setNoResults(true);
    }
  };

  const handleNewLeadClick = (contactId) => {
    setContactIdForNewLead(contactId);
    setShowNewLeadForm(true);
    setShowNewContactForm(false);
  };

  const handleCloseForm = () => {
    setShowNewLeadForm(false);
    setShowNewContactForm(false);
  };

  const handleNewContactClick = () => {
    setShowNewContactForm(true);
    setShowNewLeadForm(false);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      {!showNewLeadForm && !showNewContactForm && (
        <>
          <Typography variant="h4" mb={2}>
            New Lead
          </Typography>
          <Divider />
          <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
            <Box mb={1} mt={1} p={1}>
              <Typography variant="h5" mb={2}>
                Search Existing Contacts
              </Typography>
              <Grid container spacing={2}>
                {Object.keys(searchData).map((key) => (
                  <Grid item xs={12} md={6} key={key}>
                    <TextField
                      onChange={handleInputChange}
                      fullWidth
                      label={
                        key.charAt(0).toUpperCase() +
                        key
                          .slice(1)
                          .replace(/([A-Z])/g, " $1")
                          .trim()
                      }
                      name={key}
                      variant="outlined"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </Grid>
                ))}
              </Grid>
              <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
                Search
              </Button>
            </Box>
          </Paper>

          {searchPerformed && (
            <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}
                    >
                      First Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}
                    >
                      Last Name
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}
                    >
                      Phone
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }} component="th" scope="row">
                        {row.firstName}
                      </TableCell>
                      <TableCell align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }} >{row.lastName}</TableCell>
                      <TableCell align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}>{row.primaryEmail}</TableCell>
                      <TableCell align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}>{row.mobilePhone}</TableCell>
                      <TableCell align="center"
                      sx={{ width: "20%", borderRight: 1, borderColor: "divider" }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleNewLeadClick(row.id)}
                        >
                          Create Lead
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
            variant="contained"
            onClick={handleNewContactClick}
            sx={{ mt: 2 }}
          >
            New Contact
          </Button>
          </>
          )}

          {noResults && (
            <Paper sx={{ p: 1, mt: 2, mb: 2, textAlign: "center" }}>
              <Typography>
                No results found. You may want to create a new contact.
              </Typography>
              <Button
                variant="contained"
                onClick={handleNewContactClick}
                sx={{ mt: 2 }}
              >
                New Contact
              </Button>
            </Paper>
          )}
        </>
      )}

      {showNewLeadForm && (
        <NewLeadForm
          onCloseForm={handleCloseForm}
          contactId={contactIdForNewLead}
        />
      )}
      {showNewContactForm && (
        <NewContact
          onCloseForm={handleCloseForm}
          onNewContactCreated={setContactIdForNewLead}
          navigateTo="leads"
          leadId={contactIdForNewLead}
        />
      )}
    </Box>
  );
};

export default NewLeadComponent;
