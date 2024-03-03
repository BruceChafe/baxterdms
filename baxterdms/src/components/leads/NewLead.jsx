import React, { useState } from "react";
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
  const [newContactSubmitted, setNewContactSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prevSearchData) => ({
      ...prevSearchData,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    Object.entries(searchData).forEach(([key, value]) => {
      if (value.trim() !== "") {
        queryParams.append(key, value);
      }
    });

    fetch(`http://localhost:8000/Contacts?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setNoResults(data.length === 0);
        setTotalCount(data.length);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setNoResults(true);
      });
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
    <Box m={3}>
      {!showNewLeadForm && !showNewContactForm && !newContactSubmitted && (
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
                <Grid item xs={12} md={6}>
                  <TextField
                    onChange={handleInputChange}
                    fullWidth
                    label="First Name"
                    name="firstName"
                    variant="outlined"
                    mb={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                  <TextField
                    onChange={handleInputChange}
                    fullWidth
                    label="Email"
                    name="primaryEmail"
                    variant="outlined"
                    mb={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
                Search
              </Button>
            </Box>
          </Paper>
          <Divider />

          {noResults ? (
            <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
              <Box mb={1} mt={1} p={1}>
                {" "}
                <Box>
                  <Typography variant="body">No results found.</Typography>
                </Box>
                <Box>
                  {" "}
                  <Button
                    variant={"contained"}
                    onClick={handleNewContactClick}
                    sx={{ mt: 2 }}
                  >
                    New Contact
                  </Button>
                </Box>
              </Box>
            </Paper>
          ) : (
            searchResults.length > 0 && (
              <>
                <Paper sx={{ pt: 1, pl: 1, pr: 1, mt: 2, mb: 2 }}>
                  <Box mb={1} mt={1} p={1}>
                    <BasicTable
                      title="Results"
                      data={searchResults.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )}
                      columns={[
                        { field: "firstName", header: "First Name" },
                        { field: "lastName", header: "Last Name" },
                        { field: "primaryEmail", header: "Email" },
                        { field: "mobilePhone", header: "Phone" },
                      ]}
                      onRowClick={(row) => handleNewLeadClick(row.id)}
                      action={"Create Lead"}
                    />

                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50, 100]}
                      component="div"
                      count={totalCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Box>
                </Paper>

                <Divider />

                <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
                  <Box mb={1} mt={1} p={1} j>
                    <Button
                      variant={"contained"}
                      onClick={handleNewContactClick}
                    >
                      New Contact
                    </Button>
                  </Box>
                </Paper>
              </>
            )
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
          onNewContactCreated={handleNewContactCreated}
        />
      )}
    </Box>
  );
};

export default NewLeadComponent;
