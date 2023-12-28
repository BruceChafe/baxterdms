import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function ContactRecentActivity({ contact }) {
    return (
        <Table sx={{ minWidth: 650 }} size="large">
            <TableHead>
                <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>

            </TableBody>
        </Table>
    );
}

