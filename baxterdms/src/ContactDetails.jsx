import { Typography, List, ListItem, ListItemText, Divider, Grid } from "@mui/material";

export default function ContactDetails({ contact }) {
    return (         
                    <Typography variant="h6" gutterBottom>
                        {contact.firstName} {contact.lastName}
                    </Typography>

)}
