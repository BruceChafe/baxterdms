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
import { useFetchInventory } from "../../../hooks/FetchInventory";
import UploadData from "../upload/Upload";
import TitleLayout from "../layouts/TitleLayout";

const InventoryDashboard = () => {
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const { data, reload } = useFetchInventory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  console.log(data);

  const { inventory, loading, error } = data;

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

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout
        title={<Typography variant="h4">Inventory</Typography>}
        actionButtons={[
          {
            label: "Import",
            onClick: handleImportClick,
          },
        ]}
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
            data={inventory}
            columns={[
              { field: "dealer_name", header: "Dealership" },
              { field: "stock", header: "Stock No." },
              { field: "year", header: "Year" },
              { field: "make", header: "Make" },
              { field: "model", header: "Model" },
            ]}
            action="View More"
            baseNavigationUrl="/inventory"
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
              count={inventory.length}
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
        collectionName="preOwnedVehicleInventory"
      />
    </Box>
  );
};

export default InventoryDashboard;
