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
  Button
} from "@mui/material";
import BasicTable from "../tables/BasicTable";
import { useFetchContacts } from "../../../hooks/FetchContacts";
import UploadData from "../upload/Upload";
import FormatPhoneNumber from "../../../hooks/FormatPhoneNumber";
import FormatAddress from "../../../hooks/FormatAddress";
import TitleLayout from "../layouts/TitleLayout";

const ContactsDashboard = () => {
  const navigate = useNavigate();
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const { data, reload } = useFetchContacts();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { contacts, loading, error } = data;

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

  const transformedData =
    contacts?.map((contact) => {
      const fullName = `${contact.firstName || ""} ${
        contact.lastName || ""
      }`.trim();
      const phoneNumbers = (
        <>
          <FormatPhoneNumber type="mobile" number={contact.mobilePhone} />
          <FormatPhoneNumber type="home" number={contact.homePhone} />
          <FormatPhoneNumber type="work" number={contact.workPhone} />
        </>
      );
      const address = (
        <FormatAddress
          streetAddress={contact.streetAddress}
          city={contact.city}
          province={contact.province}
          postalCode={contact.postalCode}
        />
      );
      return {
        ...contact,
        fullName,
        phoneNumbers,
        address,
      };
    }) || [];

  const handleNewContactClick = () => {
    navigate(`/contacts/newcontact`);
  };

  const actionButtons = [
    {
      label: "Import",
      onClick: handleImportClick,
    },
    {
      label: "New Contact",
      onClick: handleNewContactClick,
    },
  ];

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">Contacts</Typography>}
        actionButtons={actionButtons}
      />
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
      ) : (
        <>
          <BasicTable
            data={transformedData}
            columns={[
              { field: "fullName", header: "Name" },
              { field: "primaryEmail", header: "Email" },
              { field: "phoneNumbers", header: "Phone Numbers" },
              { field: "address", header: "Home Address" },
            ]}
            action="View More"
            baseNavigationUrl="/contacts"
            page={page}
            rowsPerPage={rowsPerPage}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error: {error}
            </Alert>
          )}
          <Paper sx={{ mt: 2, mb: 2, border: "solid", borderColor: "divider" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={contacts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mr: 5 }}
            />
          </Paper>
        </>
      )}
      <UploadData
        showPanel={uploadPanelOpen}
        onClose={handleCloseUploadPanel}
        updateData={reload}
        collectionName="contacts"
      />
    </Box>
  );
};

export default ContactsDashboard;
