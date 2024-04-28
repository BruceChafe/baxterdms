import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useFetchLeadsAndContacts } from "../../../hooks/FechLeadsandContacts";

const LeadsDashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, totalCount } = useFetchLeadsAndContacts(page, rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const transformedData = data.combinedData.map((item) => ({
    id: item.lead.id,
    leadType: item.lead.leadType,
    leadStatus: item.lead.leadStatus,
    fullName:
      item.contacts.length > 0
        ? `${item.contacts[0].firstName} ${item.contacts[0].lastName}`
        : "No contact",
    email:
      item.contacts.length > 0 ? item.contacts[0].primaryEmail : "No email",
    leadDealership: item.lead.leadDealership,
  }));

  const handleNewLeadClick = () => {
    navigate(`/leads/newlead`);
  };

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">Leads</Typography>}
        actionButtons={[
          {
            label: "New Lead",
            onClick: handleNewLeadClick,
          },
        ]}
      />
      {data.loading ? (
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
      ) : data.error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error: {data.error}
        </Alert>
      ) : transformedData.length === 0 ? (
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

          <Paper sx={{ mt: 2, mb: 2, border: "solid", borderColor: "divider" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={totalCount}
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

export default LeadsDashboard;
