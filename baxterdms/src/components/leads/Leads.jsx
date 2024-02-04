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
import { useNavigate } from 'react-router-dom';
import LeadComponent from './Lead';

const LeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate(); // Move it inside the component function

  useEffect(() => {
    fetchLeads();
  }, [page, rowsPerPage]);

  const fetchLeads = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    fetch(`http://localhost:8000/leads?_start=${startIndex}&_end=${endIndex}`)
      .then((res) => {
        const totalCountHeader = res.headers.get('X-Total-Count');
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        return res.json();
      })
      .then((data) => {
        setLeads(data);
      })
      .catch((error) => {
        console.error('Error fetching leads:', error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    navigate(`/leads/lead/${lead.id}`, { state: { lead } });
  };
  
  return (
    <div>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Phone Numbers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <Button onClick={() => handleEditClick(lead)}>Edit</Button>
                </TableCell>
                <TableCell>{lead.leadNumber} </TableCell>
                <TableCell>{lead.leadDealership}</TableCell>
                <TableCell>{lead.leadDealership}</TableCell>
                <TableCell>{lead.leadDealership}</TableCell>
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
    </div>
  );
};

export default LeadsTable;
