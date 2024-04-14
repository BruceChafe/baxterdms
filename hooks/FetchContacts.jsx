import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchContacts = () => {
  const [data, setData] = useState({
    contacts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "contacts"));  // Define a query against the "contacts" collection
        const querySnapshot = await getDocs(q);
        const contactsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,  // Optionally include the document ID
          ...doc.data()  // Spread all fields of the document data
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
    };

    fetchData();
  }, []);

  return { data };
};

export { useFetchContacts };
