import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import Lead from "./Lead";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPerPage]);

  const fetchLeads = async () => {
    setLoading(true);
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    try {
      const response = await fetch(
        `http://localhost:8000/leads?_start=${startIndex}&_end=${endIndex}`
      );
      const totalCountHeader = response.headers.get("X-Total-Count");
      setTotalCount(parseInt(totalCountHeader, 10) || 0);
      const data = await response.json();

      const promises = data.map(async (lead) => {
        const contactResponse = await fetch(
          `http://localhost:8000/contacts?dmsid=${lead.dmsID}`
        );
        const contactData = await contactResponse.json();

        const contact = contactData[0];

        return { ...lead, ...contact };
      });

      const updatedLeads = await Promise.all(promises);
      setLeads(updatedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    document.body.style.overflow = "hidden";
  };

  const handleCloseEditPanel = () => {
    setSelectedLead(null);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Phone Numbers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Button onClick={() => handleEditClick(lead)}>Edit</Button>
                  </TableCell>
                  <TableCell>
                    {lead.firstName} {lead.lastName}
                  </TableCell>
                  <TableCell>{lead.leadDealership}</TableCell>
                  <TableCell>{lead.emailAddress1}</TableCell>
                  <TableCell>{lead.leadDealership}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Lead
        lead={selectedLead}
        showPanel={!!selectedLead}
        onClose={handleCloseEditPanel}
      />
    </>
  );
};

export default LeadsTable;
