import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useEffect } from 'react';

export default function ContactTable() {
    const [contacts, setContacts] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/Contacts')
            .then(res => res.json())
            .then(data => setContacts(data))
    }, [])

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Phone Numbers\</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts.map((contact) => (
                        <TableRow
                            key={contact.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>{contact.firstName} {contact.lastName}</TableCell>
                            <TableCell>{contact.streetAddress} <br /> {contact.city}, {contact.province}  {contact.postalCode} </TableCell>
                            <TableCell>{contact.email}</TableCell>
                            <TableCell>m: {contact.mobilePhone} <br /> h: {contact.homePhone}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}