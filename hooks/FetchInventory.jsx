import { useState, useEffect, useCallback } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchInventory = (page, rowsPerPage) => {
  const [data, setData] = useState({
    inventory: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true }));
    try {
      const q = query(collection(db, "preOwnedVehicleInventory"));
      const querySnapshot = await getDocs(q);
      const inventoryArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData({
        inventory: inventoryArray,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setData({
        inventory: [],
        loading: false,
        error: error.message,
      });
    }
  }, []);
 
  useEffect(() => {
    fetchData(); 
  }, [fetchData]);

  return { data, reload: fetchData };
};

export { useFetchInventory };
