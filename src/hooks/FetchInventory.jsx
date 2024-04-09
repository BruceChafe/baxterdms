import { useState, useEffect } from "react";

const useFetchInventory = (searchQuery = '', page, rowsPerPage) => {
  const [data, setData] = useState({
    inventory: [],
    filteredInventory: [],
    loading: true,
    error: null,
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventoryResponse = await fetch(`https://api.jsonbin.io/v3/b/661189f7e41b4d34e4e04720`, {
          headers: {
            'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu' 
          }
        });

        const inventoryResult = await inventoryResponse.json();
        const inventoryData = inventoryResult.record.inventory;
        const startIndex = page * rowsPerPage;
        const paginatedInventory = inventoryData.slice(startIndex, startIndex + rowsPerPage);
  
        setData({
          inventory: paginatedInventory,
          filteredInventory: paginatedInventory,
          loading: false,
          error: null,
        });
        setTotalCount(inventoryData.length);
      } catch (error) {
        setData((prevState) => ({
          ...prevState,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const query = typeof searchQuery === 'string' ? searchQuery.toLowerCase() : '';
    const filtered = data.inventory.filter(item =>
      item.make.toLowerCase().includes(query) ||
      item.model.toLowerCase().includes(query)
    );
    setData(prevState => ({
      ...prevState,
      filteredInventory: filtered,
      loading: false,
      error: null
    }));
    setTotalCount(filtered.length);
  }, [searchQuery, data.inventory]);

  return { inventory: data.filteredInventory, loading: data.loading, error: data.error, totalCount };
};

export { useFetchInventory };
