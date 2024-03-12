import { useState, useEffect } from "react";

const useFetchLeads = (page, rowsPerPage) => {
  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/leads?_start=${startIndex}&_end=${endIndex}`
        );
        const totalCountHeader = response.headers.get("X-Total-Count");
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        const leadsData = await response.json();

        setLeads(leadsData);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [page, rowsPerPage]);

  return { leads, totalCount, loading, error };
};

export { useFetchLeads };
