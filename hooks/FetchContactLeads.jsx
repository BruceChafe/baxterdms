import { doc, getDoc, collection } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../src/firebase';

const useFetchContactLeads = (leadIDs) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      setError(null);
      if (leadIDs && leadIDs.length > 0) {
        console.log("Fetching leads for IDs:", leadIDs); // Log the IDs being fetched
        const leadsCollection = collection(db, "leads");
        const fetchPromises = leadIDs.map(id => getDoc(doc(leadsCollection, id)));
        try {
          const leadDocs = await Promise.all(fetchPromises);
          console.log("Docs fetched:", leadDocs); // Log raw fetched documents
          const fetchedLeads = leadDocs.filter(doc => doc.exists()).map(doc => ({ id: doc.id, ...doc.data() }));
          console.log("Mapped leads:", fetchedLeads); // Log processed leads data
          setLeads(fetchedLeads);
        } catch (err) {
          console.error("Error fetching leads:", err);
          setError("Failed to fetch leads: " + err.message);
        }
      } else {
        console.log("No valid lead IDs provided");
        setError("No lead IDs provided or invalid");
        setLeads([]);
      }
      setLoading(false);
    };
  
    fetchLeads();
  }, [leadIDs]);
  

  return { leads, loading, error };
};

export { useFetchContactLeads}
