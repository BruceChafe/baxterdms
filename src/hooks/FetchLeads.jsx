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
          // Adjusted URL to point to JSONBin.io
          const url = `https://api.jsonbin.io/v3/b/66107703acd3cb34a8340b68/${number}`;
          const response = await fetch(url, {
            headers: {
              'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch lead with number ${number}`);
          }

          const data = await response.json();
          // Assuming the API returns the lead data directly; adjust if nested
          fetchedLeads.push(data.record);
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
