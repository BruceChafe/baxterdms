// TableComponent.js
import React, {useState} from "react";
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
  Typography,
} from "@mui/material";

const TableComponent = ({
  data,
  columns,
  onRowClick,
  title,

}) => {

  return (
    <>
      <Paper sx={{ p: 1, mt: 2, mb: 2 }}>
        <Box mb={1} mt={1} p={1}>
          <Typography variant="h5" mb={2}>
            {title}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.field}>{column.header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => onRowClick(row)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.field}>
                        {row[column.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </>
  );
};

export default TableComponent;
