import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  CircularProgress,
  Box,
  Typography,
  TablePagination,
  Paper,
  Alert,
  Container,
} from "@mui/material";
import LicenseHistoryTable from "./utilities/tables/LicenseHistoryTable";
import axiosInstance from "../../axios";
import { useSnackbar } from '../../context/SnackbarContext';
import TitleLayout from "../layouts/TitleLayout";

const LicenseScannerHistory = () => {
  const { showSnackbar } = useSnackbar();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      showSnackbar(`Error fetching documents: ${error.message}`, "error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    const dob = new Date(dateOfBirth);
    const diffMs = Date.now() - dob.getTime();
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const transformedData = useMemo(() => {
    return documents.map((doc) => ({
      id: doc.documentId,
      uploadDate: new Date(doc.uploadDate).toLocaleString(),
      fullName: `${doc.analysisResult?.fields?.FirstName?.value || ""} ${doc.analysisResult?.fields?.LastName?.value || ""}`.trim(),
      documentNumber: doc.analysisResult?.fields?.DocumentNumber?.content,
      age: calculateAge(doc.analysisResult?.fields?.DateOfBirth?.value),
      dateOfExpiration: doc.analysisResult?.fields?.DateOfExpiration ? new Date(doc.analysisResult.fields.DateOfExpiration.value).toLocaleDateString() : '-',
      archiveUrl: doc.archiveUrl,
      documentType: doc.documentType,
      analysisResult: doc.analysisResult,
    }));
  }, [documents]);

  return (
    <Box sx={{ mt: 3, mr: 8 }}>
      <TitleLayout title={<Typography variant="h4">License Scanner History</Typography>} />
      {loading ? (
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="300px"
            flexDirection="column"
          >
            <CircularProgress color="primary" />
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              Fetching data, please wait...
            </Typography>
          </Box>
        </Container>
      ) : (
        <>
          <LicenseHistoryTable
            data={transformedData}
            columns={[
              { field: "uploadDate", header: "Upload Date" },
              { field: "fullName", header: "Name" },
              { field: "documentNumber", header: "Document Number" },
              { field: "age", header: "Age" },
              { field: "dateOfExpiration", header: "Date of Expiration" },
            ]}
            page={page}
            rowsPerPage={rowsPerPage}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Error: {error}
            </Alert>
          )}
          <Paper sx={{ mt: 2, mb: 2, border: "solid", borderColor: "divider" }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              component="div"
              count={documents.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{ mr: 5 }}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default LicenseScannerHistory;
