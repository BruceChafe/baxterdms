import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
} from "@mui/material";

const SortingTable = ({ data, columns, defaultSortKey, defaultSortDirection, action }) => {
  const [sortConfig, setSortConfig] = useState({ key: defaultSortKey || null, direction: defaultSortDirection || 'ascending' });

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Function to perform sorting based on the sortConfig
  const sortedData = () => {
    const sortedData = [...data];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  };

  useEffect(() => {
    setSortConfig({ key: defaultSortKey || null, direction: defaultSortDirection || 'ascending' });
  }, [defaultSortKey, defaultSortDirection]);

  return (
    <>
      <Typography variant="h5" mb={2}>
        Lead History
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  <Button onClick={() => handleSort(column.field)}>
                    {column.header}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData().map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button variant="outlined" onClick={() => action(row)}>
                    {action}
                  </Button>
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SortingTable;
