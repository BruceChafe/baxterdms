import React, { useState } from "react";
import { CircularProgress, Box, Typography, Divider, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BasicTable from "../tables/BasicTable";
import { useFetchLeadsAndContacts } from "../../hooks/FechLeadsandContacts";

const LeadsTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { data, totalCount } = useFetchLeadsAndContacts(page, rowsPerPage);
  const { combinedData, loading, error } = data;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const transformedData = combinedData.map((lead) => {
    const firstName = lead.contacts[0]?.firstName || "No contact";
    const fullName = `${lead.contacts[0]?.firstName || ''} ${lead.contacts[0]?.lastName || ''}`.trim();
    const email = lead.contacts[0]?.primaryEmail || "No email";
    return {
      ...lead,
      contactFirstName: firstName,
      fullName,
      email,
    };
  });

  if (loading) return <CircularProgress />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ m: 2 }}>
          Leads
        </Typography>
      </Box>
      <Divider />
      <BasicTable
        data={transformedData}
        columns={[
          { field: "leadStatus", header: "Status" },
          { field: "contactFirstName", header: "First Name" },
          { field: "fullName", header: "Full Name" },
          { field: "email", header: "Email Address" },
          { field: "leadDealership", header: "Dealership" },
          
        ]}
      
        action="View More"
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default LeadsTable;
