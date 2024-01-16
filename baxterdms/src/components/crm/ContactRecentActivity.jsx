// Import necessary components and icons from Material-UI
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// Functional component for displaying recent activities of a contact
const ContactRecentActivity = ({ contact }) => {
    // JSX for rendering the ContactRecentActivity component
    return (
        <Table sx={{ minWidth: 650 }} size="large">
            {/* Table header */}
            <TableHead>
                <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Details</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            {/* Table body */}
            <TableBody>
                {/* Content will be populated dynamically based on contact's recent activities */}
            </TableBody>
        </Table>
    );
}

export default ContactRecentActivity;
