import { useState, useEffect, useCallback } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchContacts = () => {
  const [data, setData] = useState({
    contacts: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => { // Use useCallback to memoize the function
    setData(prev => ({ ...prev, loading: true })); // Set loading to true when starting to fetch
    try {
      const q = query(collection(db, "contacts"));
      const querySnapshot = await getDocs(q);
      const contactsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData({
        contacts: contactsArray,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setData({
        contacts: [],
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

export { useFetchContacts };
