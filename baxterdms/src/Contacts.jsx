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
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Address</TableCell>
                        <TableCell align="right">Email</TableCell>
                        <TableCell align="right">Phone</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts.map((contact) => (
                        <TableRow
                            key={contact.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell align="right">{contact.id}</TableCell>
                            <TableCell align="right">{contact.firstName} {contact.lastName}</TableCell>
                            <TableCell align="right">{contact.id}</TableCell>
                            <TableCell align="right">{contact.id}</TableCell>
                            <TableCell align="right">{contact.id}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}