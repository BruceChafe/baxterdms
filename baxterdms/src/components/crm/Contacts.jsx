// Import necessary components and icons from Material-UI
import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Backdrop } from '@mui/material';
import Contact from './Contact';
import UploadContacts from './UploadContacts';

// Functional component for ContactTable
const ContactTable = () => {
  // State variables for managing contacts, selected contact, and upload panel visibility
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(null);

  // Fetch contacts from the server on component mount
  useEffect(() => {
    fetch('http://localhost:8000/Contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  // Function to handle the click event for the "Import" button
  const handleImportClick = () => {
    setUploadPanelOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Function to handle the click event for editing a contact
  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    document.body.style.overflow = 'hidden';
  };

  // Function to handle the closing of the contact edit panel
  const handleCloseEditPanel = () => {
    setSelectedContact(null);
    document.body.style.overflow = 'auto';
  };

  // Function to handle the closing of the upload contacts panel
  const handleCloseUploadPanel = () => {
    setUploadPanelOpen(false);
    document.body.style.overflow = 'auto';
  };

  // JSX for rendering the ContactTable component
  return (
    <div>
      {/* Import button */}
      <Button color="secondary" onClick={handleImportClick}>Import</Button>

      {/* Table for displaying contacts */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* Table header */}
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Phone Numbers</TableCell>
            </TableRow>
          </TableHead>
          {/* Table body */}
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                key={contact.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Edit button for each contact */}
                <TableCell>
                  <Button onClick={() => handleEditClick(contact)}>Edit</Button>
                </TableCell>
                {/* Display contact information */}
                <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                <TableCell>
                  {contact.address.streetAddress} <br /> {contact.address.city}, {contact.address.province}  {contact.address.postalCode}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  m: <a href={`tel:${contact.phoneNumbers.mobilePhone}`} style={{ color: 'white', textDecoration: 'none' }}>{contact.phoneNumbers.mobilePhone}</a>
                  <br />
                  h: <a href={`tel:${contact.phoneNumbers.homePhone}`} style={{ color: 'white', textDecoration: 'none' }}>{contact.phoneNumbers.homePhone}</a>
                </TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Contact Panel */}
      <Contact contact={selectedContact} showPanel={!!selectedContact} onClose={handleCloseEditPanel} />

      {/* UploadContacts Panel */}
      <UploadContacts showPanel={uploadPanelOpen} onClose={handleCloseUploadPanel} />

      {/* Backdrop/Overlay */}
      <Backdrop open={!!selectedContact || uploadPanelOpen} onClick={handleCloseEditPanel} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      </Backdrop>
    </div>
  );
}

export default ContactTable;