import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchLeads = () => {
  const [data, setData] = useState({
    leads: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "leads"));
        const querySnapshot = await getDocs(q);
        const leadsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setData({
          leads: leadsArray,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching leads:", error);
        setData({
          leads: [],
          loading: false,
          error: error.message,
        });
      }
    };

    fetchData();
  }, []);

  return { data };
};

export { useFetchLeads };
