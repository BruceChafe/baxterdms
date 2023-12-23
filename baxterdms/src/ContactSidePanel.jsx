import React, { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { List, ListItemButton, ListItemText, Collapse, Table, TableRow, TableCell, Typography, Divider, TableBody } from '@mui/material';

export default function ContactSidebarMenu({ contact }) {
    const [open1, setOpen1] = useState(true);
    const [open2, setOpen2] = useState(true);
    const [open3, setOpen3] = useState(true);
    const [open4, setOpen4] = useState(true);

    const handleClick1 = () => {
        setOpen1(!open1);
    };

    const handleClick2 = () => {
        setOpen2(!open2);
    };

    const handleClick3 = () => {
        setOpen3(!open3);
    };

    const handleClick4 = () => {
        setOpen4(!open4);
    };

    return (
        <>
            <Typography variant="h6">
                {contact.firstName} {contact.lastName}
            </Typography>

            <List sx={{ width: '80%' }}>
                <Divider />

                <ListItemButton onClick={handleClick1} selected>
                    <ListItemText primary="Contact Details" />
                    {open1 ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open1} unmountOnExit>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ borderBottom: "none" }}>Email</TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{contact.emailAddress}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ borderBottom: "none" }}>Phone Number</TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{contact.phoneNumbers.mobilePhone}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Collapse>

                <ListItemButton onClick={handleClick2} selected>
                    <ListItemText primary="Vehicle Details" />
                    {open2 ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open2} unmountOnExit>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ borderBottom: "none" }}>Email</TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{contact.emailAddress}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ borderBottom: "none" }}>Phone Number</TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{contact.phoneNumbers.mobilePhone}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ borderBottom: "none" }}>Vehicle</TableCell>
                                <TableCell style={{ borderBottom: "none" }}>{contact.vehicle}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Collapse>

                <ListItemButton onClick={handleClick3} selected>
                    <ListItemText primary="Data Tags" />
                    {open3 ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open3} unmountOnExit>
                    <Table>
                        <TableRow>
                            {/* <TableCell sx={{ pl: 5 }} style={{ borderBottom: "none" }}>Actions</TableCell>
                            <TableCell style={{ borderBottom: "none" }}>Customer Name</TableCell> */}
                        </TableRow>
                    </Table>
                </Collapse>

                <ListItemButton onClick={handleClick4} selected>
                    <ListItemText primary="Notes" />
                    {open4 ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open4} unmountOnExit>
                    <Table>
                   <TableBody>
                            <TableRow>
                                <TableCell style={{ borderBottom: "none" }}>{contact.notes}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Collapse>
            </List>
        </>
    );
}
