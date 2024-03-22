import { useState, useEffect } from "react";

const useFetchInventory = (page, rowsPerPage) => {
  const [inventory, setInventory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/inventory?_start=${startIndex}&_end=${endIndex}`
        );
        const totalCountHeader = response.headers.get("X-Total-Count");
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        const inventoryData = await response.json();

        setInventory(inventoryData);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError("Failed to fetch leads");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [page, rowsPerPage]);

  return { inventory, totalCount, loading, error };
};

export { useFetchInventory };
