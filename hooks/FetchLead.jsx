import { useState, useEffect } from 'react';

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
        const response = await fetch(
          `https://api.jsonbin.io/v3/b/66118912acd3cb34a8346f91`,
          {
            headers: {
              'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch lead data');
        }

        const data = await response.json();
        const leads = data.record.leads;
        const leadData = leads.find(lead => lead.id === parseInt(leadId, 10));

        if (leadData) {
          setLead(leadData);
        } else {
          throw new Error(`Lead with id=${leadId} not found`);
        }
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
