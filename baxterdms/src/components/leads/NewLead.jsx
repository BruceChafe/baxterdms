import React, { useState } from "react";
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
} from "@mui/material";
import NewLeadForm from "./NewLeadForm";

const NewLeadComponent = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showNewLeadForm, setShowNewLeadForm] = useState(false);
  const [contactIdForNewLead, setContactIdForNewLead] = useState(null);

  const contactSearchFields = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "dmsID" },
    { label: "Phone", key: "dmsID" },
  ];

  const renderTextField = (label, key, value) => (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => handleFieldChange(key, e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
      }}
      sx={{ mb: 2, mr: 2, width: "30%" }}
    />
  );

  const renderSection = (sectionLabel, fields) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {sectionLabel}
      </Typography>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field) => (
          <div key={field.label}>
            {renderTextField(field.label, field.key, searchCriteria[field.key])}
          </div>
        ))}
      </div>
    </Box>
  );

  const handleFieldChange = (key, value) => {
    setSearchCriteria((prevSearchCriteria) => ({
      ...prevSearchCriteria,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();

    Object.entries(searchCriteria).forEach(([key, value]) => {
      if (value.trim() !== "") {
        queryParams.append(key, value);
      }
    });

    fetch(`http://localhost:8000/Contacts?${queryParams.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setNoResults(data.length === 0);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setNoResults(true);
      });
  };

  const handleNewLeadClick = (contactId) => {
    setContactIdForNewLead(contactId);
    setShowNewLeadForm(true);
  };

  const handleCloseForm = () => {
    setShowNewLeadForm(false);
  };

  return (
    <Box>
      {!showNewLeadForm && (
        <>
          {renderSection("Basic Information", contactSearchFields)}
          <Button variant="outlined" onClick={handleSearch} sx={{ mb: 2 }}>
            Search
          </Button>

          {noResults ? (
            <Typography variant="body1">No results found.</Typography>
          ) : (
            searchResults.length > 0 && (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.id}</TableCell>
                          <TableCell>{contact.firstName}</TableCell>
                          <TableCell>{contact.lastName}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              onClick={() => handleNewLeadClick(contact.id)}
                            >
                              New Lead
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )
          )}
        </>
      )}

      {showNewLeadForm && (
        <NewLeadForm onCloseForm={handleCloseForm} contactId={contactIdForNewLead} />
      )}
    </Box>
  );
};

export default NewLeadComponent;
