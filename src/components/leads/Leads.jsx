import React, { useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  TablePagination,
  Paper,
  Alert,
  Container,
} from "@mui/material";
import BasicTable from "../tables/BasicTable";
import TitleLayout from "../layouts/TitleLayout";
import { useFetchLeads } from "../../../hooks/FetchLeads";

const LeadsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, reload } = useFetchLeads(); // Ensure to handle reload if needed
  const { leads, loading, error } = data;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const transformedData = leads.map((lead) => {
    const hasContacts = lead.contacts && lead.contacts.length > 0;
    const firstName = hasContacts ? lead.contacts[0].firstName : "No contact";
    const lastName = hasContacts ? lead.contacts[0].lastName : "";
    const email = hasContacts ? lead.contacts[0].primaryEmail : "No email";
  
    const fullName = hasContacts ? `${firstName} ${lastName}`.trim() : "No contact details";
  
    return {
      ...lead,
      contactFirstName: firstName,
      fullName,
      email,
    };
  });
  

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout title={<Typography variant="h4">Leads</Typography>} />
      {loading ? (
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            flexDirection="column"
          >
            <CircularProgress color="primary" />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Fetching data, please wait...
            </Typography>
          </Box>
        </Container>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {error}
        </Alert>
      ) : leads.length === 0 ? (
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          No leads found.
        </Typography>
      ) : (
        <>
          <BasicTable
            data={transformedData}
            columns={[
              { field: "leadType", header: "Lead Type" },
              { field: "leadStatus", header: "Status" },
              { field: "fullName", header: "Full Name" },
              { field: "email", header: "Email Address" },
              { field: "leadDealership", header: "Dealership" },
            ]}
            action="View More"
            baseNavigationUrl="/leads"
            page={page}
            rowsPerPage={rowsPerPage}
          />
          <Paper sx={{ mt: 2, mb: 2 }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={leads.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mr: 5 }}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default LeadsTable;
