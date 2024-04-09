import { useState, useEffect, useCallback } from "react";

function useFetchLeadAndContact(leadNumber) {
  const [data, setData] = useState({
    lead: null,
    contact: null,
    primaryEmail: null,
    loading: true,
    error: null,
  });
  const [trigger, setTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    setData((prev) => ({ ...prev, loading: true }));
    try {
      const leadRes = await fetch(
        `http://localhost:8000/Leads/?leadNumber=${leadNumber}`
      );
      const leadData = await leadRes.json();
      const contactRes = await fetch(
        `http://localhost:8000/contacts?leadNumbers_like=${leadNumber}`
      );
      const contactData = await contactRes.json();
      setData({
        lead: leadData[0] || null,
        contact: contactData[0] || null,
        primaryEmail: contactData[0]?.primaryEmail || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setData((prev) => ({ ...prev, loading: false, error: error.toString() }));
    }
  }, [leadNumber]);

  useEffect(() => {
    fetchData();
  }, [leadNumber, trigger, fetchData]);

  const refetch = useCallback(() => {
    setTrigger((prev) => prev + 1);
  }, []);

  return { ...data, refetch };
}

export { useFetchLeadAndContact };
