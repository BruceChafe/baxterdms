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
import { useFetchInventory } from "../../hooks/FetchInventory";
import UploadData from "../upload/Upload";

const Inventory = () => {
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { inventory, totalCount, loading, error } = useFetchInventory(
    page,
    rowsPerPage
  );

  const transformedData = inventory.map((inventory) => ({
    ...inventory,
    dealerName: `${inventory.dealer_name}`,
    stockNumber: `${inventory.stock}`,
    modelYear: `${inventory.year}`,
    modelMake: `${inventory.make}`,
    modelModel: `${inventory.model}`,
  }));
  console.log(inventory);

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
    <Box sx={{ mt: 3, mr: 8 }} height={80}>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        height={80}
      >
        <Typography variant="h4" sx={{ m: 2 }}>
          Inventory
        </Typography>
        <Button variant="outlined" onClick={handleImportClick}>
          Import
        </Button>
      </Box>
      <Divider />
      <BasicTable
        data={transformedData}
        columns={[
          { field: "dealerName", header: "Dealership" },
          { field: "stockNumber", header: "Stock No." },
          { field: "modelYear", header: "Year" },
          { field: "modelMake", header: "Make" },
          { field: "modelModel", header: "Model" },

        ]}
        action="View More"
        baseNavigationUrl="/inventory"
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
        updateData={useFetchInventory}
        uploadUrl="http://localhost:8000/inventory"
        uploadMethod="POST"
        stepLabels={["Upload Inventory"]}
      />
    </Box>
  );
};

export default Inventory;
