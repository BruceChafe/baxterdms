import React, { useState, useEffect } from "react";
import { Button, TablePagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TableComponent from "../tables/DataTable";
import UploadData from "../upload/Upload";

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, [page, rowsPerPage]);

  const fetchContacts = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    fetch(`http://localhost:8000/Contacts?_start=${startIndex}&_end=${endIndex}`)
      .then((res) => {
        const totalCountHeader = res.headers.get("X-Total-Count");
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        return res.json();
      })
      .then((data) => {
        setContacts(data);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
      });
  };

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

  const handleEditClick = (contact) => {
    navigate(`/contacts/${contact.id}`);
      };


  const handleCloseUploadPanel = () => {
    setUploadPanelOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <Button color="secondary" onClick={handleImportClick}>
        Import
      </Button>
      <TableComponent
        data={contacts}
        columns={[
          { field: "firstName", header: "First Name" },
          { field: "lastName", header: "Last Name" },
          { field: "email", header: "Email" },
        ]}
        onRowClick={handleEditClick}
        action={"Edit"}
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
      <UploadData
        showPanel={uploadPanelOpen}
        onClose={handleCloseUploadPanel}
        updateData={fetchContacts}
        uploadUrl="http://localhost:8000/contacts"
        uploadMethod="POST"
        stepLabels={["Upload Contacts"]}
      />
    </>
  );
};

export default ContactTable;