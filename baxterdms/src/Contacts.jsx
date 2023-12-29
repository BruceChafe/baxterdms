import React, { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Backdrop } from '@mui/material';
import Contact from './Contact';

function ContactTable() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/Contacts')
      .then((res) => res.json())
      .then((data) => setContacts(data));
  }, []);

  const handleEditClick = (contact) => {
    setSelectedContact(contact);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseEditPanel = () => {
    setSelectedContact(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
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

      {/* Backdrop/Overlay */}
      <Backdrop open={!!selectedContact} onClick={handleCloseEditPanel} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      </Backdrop>
    </div>
  );
}

export default ContactTable;
