import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase';

const useFetchLeads = (leadIDs) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      let q;
      if (leadIDs && leadIDs.length > 0) {
        q = query(collection(db, "leads"), where('id', 'in', leadIDs.slice(0, 10)));
      } else {
        q = query(collection(db, "leads"));
      }

      try {
        const querySnapshot = await getDocs(q);
        const fetchedLeads = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(fetchedLeads);
      } catch (err) {
        setError(`Failed to fetch leads: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [leadIDs]);

  return { leads, loading, error };
};

export { useFetchLeads };
