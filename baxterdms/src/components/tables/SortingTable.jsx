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

const SortingTable = ({
  data,
  columns,
  defaultSortKey,
  defaultSortDirection,
  action,
}) => {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSortKey || null,
    direction: defaultSortDirection || "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    const sortedData = [...data];
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedData;
  };

  const renderCellContent = (content, isActivityDetails = false) => {
    if (!isActivityDetails || typeof content !== 'string') {
      return content;
    }
    return content.split("\n").map((line, index) => (
      <Typography key={index} variant="body2">
        {line}
      </Typography>
    ));
  };
  
  useEffect(() => {
    setSortConfig({
      key: defaultSortKey || null,
      direction: defaultSortDirection || "ascending",
    });
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
              {columns.map((column, index) => (
                <TableCell
                  key={column.field}
                  align="center"
                  sx={{
                    borderTop: 1,
                    borderRight: index !== columns.length - 1 ? 1 : 0,
                    borderColor: "divider",
                  }}
                >
                  {" "}
                  <Button onClick={() => handleSort(column.field)}>
                    {column.header}
                  </Button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData().map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={`${rowIndex}-${colIndex}`}
                    align="center"
                    sx={{
                      borderRight: colIndex !== columns.length - 1 ? 1 : 0,
                      borderColor: "divider",
                    }}
                  >
                    {column.field === "activityDetails"
                      ? renderCellContent(row[column.field], true)
                      : renderCellContent(row[column.field])}
                  </TableCell>
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
