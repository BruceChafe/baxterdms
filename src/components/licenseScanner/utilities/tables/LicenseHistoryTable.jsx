import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LicenseScannerDetail from "../../LicenseScannerDetail";

const LicenseHistoryTable = ({ data, columns, page, rowsPerPage, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const cellWidth = `${100 / (columns.length + 1)}%`;

  return (
    <Box sx={{ mt: 3 }}>
      <Paper sx={{ mt: 2, mb: 2 }}>
        <TableContainer
          component={Paper}
          sx={{
            border: "solid",
            borderColor: "divider",
            height: "75vh",
            overflow: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    borderRight: 1,
                    borderColor: "divider",
                    width: cellWidth,
                  }}
                >
                  Actions
                </TableCell>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.field}
                    align="center"
                    sx={{
                      width: cellWidth,
                      borderRight: index !== columns.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell
                    align="center"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    <Tooltip title="Open">
                      <Button
                        variant="outlined"
                        onClick={() => handleClickOpen(row)}
                      >
                        View More
                      </Button>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => onNavigate(row.id)}
                      sx={{ ml: 1 }}
                    >
                      Full Profile
                    </Button>
                  </TableCell>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        borderRight: index !== columns.length - 1 ? 1 : 0,
                        borderColor: "divider",
                      }}
                    >
                      {row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedRow?.analysisResult?.fields?.DocumentNumber?.content}
        </DialogTitle>
        <DialogContent dividers>
          {selectedRow && <LicenseScannerDetail document={selectedRow} />}
          {selectedRow && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  handleClose();
                  onNavigate(selectedRow.id);
                }}
              >
                Go to Full Profile
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LicenseHistoryTable;
