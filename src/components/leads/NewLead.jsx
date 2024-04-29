import React, { useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
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
  Divider,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import InputMask from "react-input-mask";
import NewLeadForm from "./NewLeadForm";
import NewContact from "../contacts/NewContact";
import TitleLayout from "../layouts/TitleLayout";

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSearchPerformed(false);
  };

  const handleDeleteContact = async (contactId) => {
    const docRef = doc(db, "contacts", contactId);
    try {
      await deleteDoc(docRef);
      setSearchResults(
        searchResults.filter((contact) => contact.id !== contactId)
      );
      setSnackbarMessage("Contact deleted successfully.");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting contact:", error);
      setSnackbarMessage("Failed to delete contact.");
      setSnackbarOpen(true);
    }
  };

  const handleSearch = async () => {
    if (!searchData.firstName.trim() || !searchData.mobilePhone.trim()) {
      setSnackbarMessage("First Name and Mobile Phone are required.");
      setSnackbarOpen(true);
      return;
    }
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

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {!showNewLeadForm && !showNewContactForm && (
        <>
          <TitleLayout title={<Typography variant="h4">New Lead</Typography>} />
          <Box sx={{ mt: 3 }}>
            <Paper
              sx={{
                border: "solid",
                borderColor: "divider",
                p: 3,
                mb: 2,
              }}
            >
              <Typography variant="h5" mb={2}>
                Search Existing Contacts
              </Typography>
              <Grid container spacing={2}>
                {Object.keys(searchData).map((key) => (
                  <Grid item xs={12} md={6} key={key}>
                    {key === "mobilePhone" ? (
                      <InputMask
                        mask="(999) 999-9999"
                        value={searchData.mobilePhone}
                        onChange={handleInputChange}
                        disabled={false}
                        maskChar=" "
                      >
                        {() => (
                          <TextField
                            fullWidth
                            label="Mobile Phone"
                            name="mobilePhone"
                            variant="outlined"
                            required={key === "mobilePhone"}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSearch()
                            }
                          />
                        )}
                      </InputMask>
                    ) : (
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
                        required={key === "firstName" || key === "mobilePhone"}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
              <Button variant="outlined" onClick={handleSearch} sx={{ mt: 2 }}>
                Search
              </Button>
            </Paper>
          </Box>

          {searchPerformed && searchResults.length > 0 && (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  border: "solid",
                  borderColor: "divider",
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        sx={{
                          width: "20%",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        First Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: "20%",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        Last Name
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: "20%",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: "20%",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        Phone
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: "20%",
                          borderRight: 1,
                          borderColor: "divider",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell
                            align="center"
                            sx={{
                              width: "20%",
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          >
                            {row.firstName}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              width: "20%",
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          >
                            {row.lastName}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              width: "20%",
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          >
                            {row.primaryEmail}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              width: "20%",
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          >
                            {row.mobilePhone}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              width: "20%",
                              borderRight: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Button
                              variant="outlined"
                              onClick={() => handleNewLeadClick(row.id)}
                            >
                              Create Lead
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleDeleteContact(row.id)}
                              sx={{ ml: 1 }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Paper
                sx={{
                  mt: 2,
                  mb: 2,
                  p: 2,
                  border: "solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Button variant="outlined" onClick={handleNewContactClick}>
                  New Contact
                </Button>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50, 100]}
                  component="div"
                  count={searchResults.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            </>
          )}

          {searchPerformed && noResults && (
            <Paper sx={{ p: 1, mt: 2, mb: 2, textAlign: "center", border: "solid", borderColor: "divider" }}>
              <Typography>
                No results found. You may want to create a new contact.
              </Typography>
              <Button
                variant="outlined"
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
