import React, { useState } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  TablePagination,
  Paper,
} from "@mui/material";
import BasicTable from "../tables/BasicTable";
import { useFetchInventory } from "../../hooks/FetchInventory";
import UploadData from "../upload/Upload";
import SearchComponent from "../../hooks/search/SearchComponent";
import { useDebounce } from "../../hooks/search/DebouncedValue";
import TitleLayout from "../layouts/TitleLayout";

const InventoryDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { inventory, loading, error, totalCount } = useFetchInventory(
    debouncedSearchQuery,
    page,
    rowsPerPage
  );

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
      <Paper sx={{ mt: 2, mb: 2 }}>
        <Paper sx={{ mt: 2, mb: 2, p: 1 }}>
          <SearchComponent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Paper>
      </Paper>
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
        uploadUrl="http://localhost:8000/inventory"
        uploadMethod="POST"
        stepLabels={["Upload Inventory"]}
      />
    </Box>
  );
};

export default InventoryDashboard;