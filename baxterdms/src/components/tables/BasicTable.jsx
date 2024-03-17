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

const BasicTable = ({ data, columns, action }) => {
  const [error, setError] = useState("");

  return (
    <Box m={3}>
      {error && <Typography color="error">{error}</Typography>}
      <Paper sx={{ mt: 2, mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ borderRight: 1, borderColor: "divider" }}
                >
                  Actions
                </TableCell>
                {columns.map((column, index) => (
                  <TableCell
                    key={column.field}
                    align="center"
                    sx={{
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
                <TableRow key={row.leadNumber}>
                  <TableCell
                    align="center"
                    sx={{ borderRight: 1, borderColor: "divider" }}
                  >
                    <Button
                      variant="outlined"
                      component={Link}
                      to={`/leads/${row.leadNumber}`}
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
