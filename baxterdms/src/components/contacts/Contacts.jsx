import React, { useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  Divider,
  TablePagination,
  Paper,
  Button,
} from "@mui/material";
import BasicTable from "../tables/BasicTable";
import { useFetchContacts } from "../../hooks/FetchContacts";
import UploadData from "../upload/Upload";
import FormatPhoneNumber from "../../hooks/FormatPhoneNumber"
import FormatAddress from "../../hooks/FormatAddress"

const ContactTable = () => {
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { contacts, totalCount, loading, error } = useFetchContacts(
    page,
    rowsPerPage
  );
  
  const transformedData = contacts.map(contact => ({
    ...contact,
    fullName: `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
    phoneNumbers: (
      <>
        <FormatPhoneNumber type="mobile" number={contact.mobilePhone} />
        <FormatPhoneNumber type="home" number={contact.homePhone} />
        <FormatPhoneNumber type="work" number={contact.workPhone} />
      </>
    ),
    address: (
      <FormatAddress
        streetAddress={contact.streetAddress}
        city={contact.city}
        province={contact.province}
        postalCode={contact.postalCode}
      />
    )
  }));
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleImportClick = () => {
    setUploadPanelOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseUploadPanel = () => {
    setUploadPanelOpen(false);
    document.body.style.overflow = "auto";
  };

  if (loading) return <CircularProgress />;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box sx={{ m: 3 }}>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ m: 2 }}>
          Contacts
        </Typography>
        <Button variant="outlined" onClick={handleImportClick}>
          Import
        </Button>
      </Box>
      <Divider />
      <BasicTable
        data={transformedData}
        columns={[
          { field: "fullName", header: "Last Name" },
          { field: "primaryEmail", header: "Email" },
          { field: "phoneNumbers", header: "Phone Numbers"},
          { field: "address", header: "Home Address"},
        ]}
        action="View More"
        baseNavigationUrl="/contacts"
      />
      <Paper sx={{ mt: 2, mb: 2 }}>
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
      <UploadData
        showPanel={uploadPanelOpen}
        onClose={handleCloseUploadPanel}
        updateData={useFetchContacts}
        uploadUrl="http://localhost:8000/contacts"
        uploadMethod="POST"
        stepLabels={["Upload Contacts"]}
      />
    </Box>
  );
};

export default ContactTable;
