import { useState, useEffect } from "react";

const useFetchInventory = (searchQuery = '') => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch('http://localhost:8000/inventory');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setInventory(data);
        setTotalCount(data.length);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  useEffect(() => {
    const query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
    const filtered = inventory.filter(item =>
      item.make.toLowerCase().includes(query) ||
      item.model.toLowerCase().includes(query)
    );
    setFilteredInventory(filtered);
    setTotalCount(filtered.length);
  }, [searchQuery, inventory]);

  return { inventory: filteredInventory, loading, error, totalCount };
};

export { useFetchInventory };
