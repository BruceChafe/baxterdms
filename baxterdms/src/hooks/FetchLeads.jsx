import { useState, useEffect } from 'react';

const useFetchLeads = (leadNumbers) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      if (leadNumbers.length === 0) {
        setLeads([]);
        return;
      }

      setLoading(true);
      setError('');
      const fetchedLeads = [];

      for (const number of leadNumbers) {
        try {
          const response = await fetch(`http://localhost:8000/leads/?leadNumber=${number}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch lead with number ${number}`);
          }
          const leadData = await response.json();
          fetchedLeads.push(...leadData);
        } catch (error) {
          console.error('Error fetching lead:', error);
          setError(`Failed to fetch leads. ${error.message}`);
        }
      }

      setLeads(fetchedLeads);
      setLoading(false);
    };

    fetchLeads();
  }, [leadNumbers]);

  return { leads, loading, error };
};

export { useFetchLeads };
