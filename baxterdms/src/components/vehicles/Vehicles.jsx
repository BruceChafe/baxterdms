import React, { useState, useEffect } from "react";
import { Button, TablePagination } from "@mui/material";
import UploadData from "../upload/Upload";
import Vehicle from "./Vehicle";
import BasicTable from "../tables/BasicTable";

const VehiclesTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, [page, rowsPerPage]);

  const fetchVehicles = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    fetch(
      `http://localhost:8000/vehicles?_start=${startIndex}&_end=${endIndex}`
    )
      .then((res) => {
        const totalCountHeader = res.headers.get("X-Total-Count");
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        return res.json();
      })
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
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

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    document.body.style.overflow = "hidden";
  };

  const handleCloseEditPanel = () => {
    setSelectedVehicle(null);
    document.body.style.overflow = "auto";
  };

  const handleCloseUploadPanel = () => {
    setUploadPanelOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div>
      <Button color="secondary" onClick={handleImportClick}>
        Import
      </Button>

      <BasicTable
        data={vehicles}
        columns={[
          { field: "modelMake", header: "Make" },
          { field: "modelModel", header: "Model" },
          { field: "vin", header: "VIN" },
          { field: "kms", header: "KMs" },
          { field: "dmsID", header: "Current Owner" },
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

      <Vehicle
        vehicle={selectedVehicle}
        showPanel={!!selectedVehicle}
        onClose={handleCloseEditPanel}
      />
      <UploadData
        showPanel={uploadPanelOpen}
        onClose={handleCloseUploadPanel}
        updateData={fetchVehicles}
        uploadUrl="http://localhost:8000/vehicles"
        uploadMethod="POST"
        stepLabels={["Upload Vehicles"]}
      />
    </div>
  );
};

export default VehiclesTable;
