import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import UploadVehicles from './UploadVehicles';
import Vehicle from './Vehicle';

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

    fetch(`http://localhost:8000/vehicles?_start=${startIndex}&_end=${endIndex}`)
      .then((res) => {
        const totalCountHeader = res.headers.get('X-Total-Count');
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        return res.json();
      })
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        console.error('Error fetching vehicles:', error);
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
    document.body.style.overflow = 'hidden';
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseEditPanel = () => {
    setSelectedVehicle(null);
    document.body.style.overflow = 'auto';
  };

  const handleCloseUploadPanel = () => {
    setUploadPanelOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div>
      <Button color="secondary" onClick={handleImportClick}>
        Import
      </Button>

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>EDIT</TableCell>
              <TableCell>Make</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>VIN</TableCell>
              <TableCell>KMs</TableCell>
              <TableCell>Current Owner</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <Button onClick={() => handleEditClick(vehicle)}>Edit</Button>
                </TableCell>
                <TableCell>{vehicle.modelMake}</TableCell>
                <TableCell>{vehicle.modelModel}</TableCell>
                <TableCell>{vehicle.vin}</TableCell>
                <TableCell>{vehicle.kms}</TableCell>
                <TableCell>{vehicle.dmsID}</TableCell>
              </TableRow>
            ))}
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

      <Vehicle vehicle={selectedVehicle} showPanel={!!selectedVehicle} onClose={handleCloseEditPanel} />
      <UploadVehicles showPanel={uploadPanelOpen} onClose={handleCloseUploadPanel} />
    </div>
  );
};

export default VehiclesTable;
