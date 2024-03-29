import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const BasicTable = ({ data, columns, action, baseNavigationUrl }) => {
  const [error, setError] = useState("");

  const cellWidth = `${100 / (columns.length + 1)}%`;

  return (
    <Box>
      {error && <Typography color="error">{error}</Typography>}
      <Paper elevation={3} sx={{ mt: 2, mb: 2 }}>
        <TableContainer component={Paper}>
          <Table
            sx={{
              "&:active": { boxShadow: "none" },
            }}
          >
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
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  {" "}
                  <TableCell
                    align="center"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    <Button
                      variant="outlined"
                      component={Link}
                      to={`${baseNavigationUrl}/${row.leadNumber || row.id}`}
                    >
                      {action}
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
    </Box>
  );
};

export default BasicTable;
