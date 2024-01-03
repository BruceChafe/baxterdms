import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Backdrop } from '@mui/material';
import Contact from './Contact';
import UploadContacts from './UploadContacts';

function ContactTable() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/Contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const handleImportClick = () => {
    setUploadPanelOpen(true);
    // document.body.style.overflow = 'hidden';
  };

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseEditPanel = () => {
    setSelectedContact(null);
    document.body.style.overflow = 'auto';
  };

  const handleCloseUploadPanel = () => {
    setUploadPanelOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
      <Button color="secondary" onClick={handleImportClick}>Import</Button>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Phone Numbers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                key={contact.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>
                  <Button onClick={() => handleEditClick(contact)}>Edit</Button>
                </TableCell>
                <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                <TableCell>
                  {contact.streetAddress} <br /> {contact.city}, {contact.province}  {contact.postalCode}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>m: {contact.mobilePhone} <br /> h: {contact.homePhone}</TableCell>
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
