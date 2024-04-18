import { useState, useEffect } from 'react';
import { db } from '../src/firebase';
import { doc, getDoc } from 'firebase/firestore';

const useFetchLead = (leadId) => {
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeadData = async () => {
      if (!leadId) {
        setLead(null);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const leadDocRef = doc(db, 'leads', leadId); // Specify the collection and document ID
        const docSnapshot = await getDoc(leadDocRef);

        if (!docSnapshot.exists()) {
          throw new Error(`Lead with id=${leadId} not found`);
        }

        setLead(docSnapshot.data()); // Set the lead data from Firestore document
      } catch (error) {
        console.error('Error fetching lead data:', error);
        setError(`Failed to fetch lead. ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadData();
  }, [leadId]);

  return { lead, loading, error };
};

export { useFetchLead };
