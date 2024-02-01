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

const NewLeadComponent = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const contactSearchFields = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
  ];

  const renderTextField = (label, key, value) => (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={(e) => handleFieldChange(key, e.target.value)}
      sx={{ mr: 2, width: "15%" }}
    />
  );

  const renderSection = (sectionLabel, fields) => (
    <Box label={sectionLabel}>
      <Typography variant="h6">{sectionLabel}</Typography>
      {fields.map((field) => (
        <React.Fragment key={field.label}>
          {renderTextField(field.label, field.key, searchCriteria[field.key])}
        </React.Fragment>
      ))}
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

  return (
    <Box>
      {renderSection("Basic Information", contactSearchFields)}
      <Button variant="outlined" onClick={handleSearch}>Search</Button>

      {noResults ? (
        <>
          <Typography variant="body1">No results found.</Typography>
          <Button variant="outlined">Create New Contact & Lead</Button>
        </>
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
                      <Button variant="outlined">New Lead</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="outlined">Create New Contact & Lead</Button>
          </>
        )
      )}
    </Box>
  );
};

export default NewLeadComponent;
