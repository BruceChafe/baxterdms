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

      if (!leadIDs || leadIDs.length === 0) {
        console.log("No valid lead IDs provided");
        setLoading(false);
        setLeads([]);
        return;
      }

      const leadsCollection = collection(db, "leads");
      const fetchPromises = leadIDs.map(id => getDoc(doc(leadsCollection, id)));

      try {
        const leadDocs = await Promise.all(fetchPromises);
        const fetchedLeads = leadDocs.filter(doc => doc.exists()).map(doc => ({ id: doc.id, ...doc.data() }));

        if (fetchedLeads.length > 0) {
          setLeads(fetchedLeads);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.error("Error fetching leads:", err);
        setError("Failed to fetch leads: " + err.message);
      }

      setLoading(false);
    };

    fetchLeads();
  }, [leadIDs]);

  return { leads, loading, error };
};

export { useFetchContactLeads }
