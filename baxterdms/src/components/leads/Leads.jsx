import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@mui/material";
import Lead from "./Lead";
import TableComponent from "../tables/DataTable";

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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
  
      for (const lead of leadsData) {
        const contactResponse = await fetch(
          `http://localhost:8000/contacts?dmsid=${lead.dmsID}`
        );
        const contactData = await contactResponse.json();
  
        const contact = contactData.find(contact => contact.dmsID === lead.dmsID);
  
        if (contact) {
          const fullName = `${contact.firstName} ${contact.lastName}`;
          updatedLeads.push({ ...lead, ...contact, fullName });
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
    <Typography variant="h4" sx={{m: 2 }}>Leads</Typography>
      <TableComponent
        data={leads}
        columns={[
          { field: "leadStatus", header: "Status" },
          { field: "firstName", header: "Lead Type" },
          { field: "fullName", header: "Full Name" },
          { field: "emailAddress1", header: "Email Address" },
          { field: "leadDealership", header: "Phone Numbers" },
        ]}
        totalCount={totalCount}
        onRowClick={handleEditClick}
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

      <Lead
        lead={selectedLead}
        showPanel={!!selectedLead}
        onClose={handleCloseEditPanel}
      />
    </>
  );
};

export default LeadsTable;
