import React, { useState } from 'react';
import { Box, CircularProgress, Divider, Paper, TablePagination, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BasicTable from "../tables/BasicTable";
import { useFetchLeads } from '../../hooks/FetchLeads';

const LeadsTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const navigate = useNavigate();

  const { leads, totalCount, loading, error } = useFetchLeads(page, rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (lead) => {
    navigate(`/leads/${lead.leadNumber}`);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <Box m={3}>
      <Typography variant="h4" sx={{ m: 2 }}>
        Leads
      </Typography>
      <Divider />
      <Paper sx={{ p: 2, mt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <BasicTable
            data={leads}
            columns={[
              { field: 'leadStatus', header: 'Status' },
              { field: 'firstName', header: 'Lead Type' },
              { field: 'fullName', header: 'Full Name' },
              { field: 'email', header: 'Email Address' },
              { field: 'leadDealership', header: 'Dealership' },
            ]}
            onRowClick={handleEditClick}
            action="Edit"
          />
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default LeadsTable;
