import React, { useState, useEffect } from "react";
import {
  TablePagination,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BasicTable from "../tables/BasicTable";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPerPage]);

  const fetchLeads = async () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    try {
      const response = await fetch(
        `http://localhost:8000/leads?_start=${startIndex}&_end=${endIndex}`
      );
      const totalCountHeader = response.headers.get("X-Total-Count");
      setTotalCount(parseInt(totalCountHeader, 10) || 0);
      const leadsData = await response.json();

      const updatedLeads = [];

      for (let i = 0; i < leadsData.length; i++) {
        const lead = leadsData[i];
        const contactResponse = await fetch(
          `http://localhost:8000/contacts?leadNumbers_like=${lead.leadNumber}`
        );
        const contactData = await contactResponse.json();

        if (contactData.length > 0) {
          for (const contact of contactData) {
            const fullName = `${contact.firstName} ${contact.lastName}`;
            updatedLeads.push({ ...lead, ...contact, fullName });
          }
        } else {
          updatedLeads.push(lead);
        }
      }

      setLeads(updatedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (lead, index) => {
    navigate(`/leads/${lead.leadNumber}`);
  };

  const handleCloseEditPanel = () => {
    setSelectedLead(null);
    document.body.style.overflow = "auto";
  };

  return (
    <Box m={3}>
      <Box
        sx={{
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
      <Paper sx={{ pt: 1, pl: 1, pr: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          <BasicTable
            data={leads}
            columns={[
              { field: "leadStatus", header: "Status" },
              { field: "firstName", header: "Lead Type" },
              { field: "fullName", header: "Full Name" },
              { field: "email", header: "Email Address" },
              { field: "leadDealership", header: "Phone Numbers" },
            ]}
            onRowClick={(rowData, index) => handleEditClick(rowData, index)}
            action={"View Lead"}
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
      </Paper>
    </Box>
  );
};

export default LeadsTable;
