import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import Contact from './Contact';
import UploadContacts from './UploadContacts';

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchCriteria, setSearchCriteria] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    fetchContacts();
  }, [page, rowsPerPage, searchCriteria]);

  const fetchContacts = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
        const searchParams = new URLSearchParams(searchCriteria);


    fetch(`http://localhost:8000/Contacts?_start=${startIndex}&_end=${endIndex}`)
      .then((res) => {
        const totalCountHeader = res.headers.get('X-Total-Count');
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        return res.json();
      })
      .then((data) => {
        setContacts(data);
      })
      .catch((error) => {
        console.error('Error fetching contacts:', error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleImportClick = () => {
    setUploadPanelOpen(true);
    document.body.style.overflow = 'hidden';
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
      <Button color="secondary" onClick={handleImportClick}>
        Import
      </Button>

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
              <TableRow key={contact.id}>
                <TableCell>
                  <Button onClick={() => handleEditClick(contact)}>Edit</Button>
                </TableCell>
                <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                <TableCell>
                  {contact.address && contact.address.streetAddress} <br />
                  {contact.address && contact.address.city}, {contact.address && contact.address.province}  {contact.address && contact.address.postalCode}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>
                  {contact.phoneNumbers && contact.phoneNumbers.mobilePhone &&
                    <>
                      m: <a href={`tel:${contact.phoneNumbers.mobilePhone}`} style={{ color: 'white', textDecoration: 'none' }}>{contact.phoneNumbers.mobilePhone}</a>
                      <br />
                    </>
                  }
                  {contact.phoneNumbers && contact.phoneNumbers.homePhone &&
                    <>
                      h: <a href={`tel:${contact.phoneNumbers.homePhone}`} style={{ color: 'white', textDecoration: 'none' }}>{contact.phoneNumbers.homePhone}</a>
                    </>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Contact contact={selectedContact} showPanel={!!selectedContact} onClose={handleCloseEditPanel} />
      <UploadContacts showPanel={uploadPanelOpen} onClose={handleCloseUploadPanel} />
    </div>
  );
};

export default ContactTable