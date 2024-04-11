import { useState, useEffect } from 'react';

const useFetchLeads = (leadNumbers) => {
  const [data, setData] = useState({
    leads: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setData(prev => ({ ...prev, loading: true })); // Start loading
      try {
        const leadsResponse = await fetch(`https://api.jsonbin.io/v3/b/66107703acd3cb34a8340b68/`, {
          headers: {
            'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
          }
        });

        if (!leadsResponse.ok) {
          throw new Error(`Failed to fetch leads`);
        }

        const leadsResult = await leadsResponse.json();
        const leadsData = leadsResult.record.leads;

        // If you need to filter leads by leadNumbers
        // const filteredLeads = leadsData.filter(lead => leadNumbers.includes(lead.leadNumber));

        setData({ 
          leads: leadsData, // or filteredLeads if filtering
          loading: false,
          error: null
        });
      } catch (error) {
        setData({ leads: [], loading: false, error: error.message });
      }
    };

    fetchData();
  }, [leadNumbers]); // Ensure leadNumbers is stable, consider memoization if it's derived

  return { data };
};

export { useFetchLeads };
