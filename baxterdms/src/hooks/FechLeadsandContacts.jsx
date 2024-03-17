import { useState, useEffect } from "react";

const useFetchLeadsAndContacts = (page, rowsPerPage) => {
  const [data, setData] = useState({
    leads: [],
    contacts: [],
    combinedData: [],
    loading: true,
    error: null,
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      try {
        const leadsResponse = await fetch(`http://localhost:8000/leads?_start=${startIndex}&_end=${endIndex}`);
        const totalCountHeader = leadsResponse.headers.get("X-Total-Count");
        setTotalCount(parseInt(totalCountHeader, 10) || 0);
        
        
        const contactsResponse = await fetch(`http://localhost:8000/contacts`);
        if (!leadsResponse.ok || !contactsResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const leadsData = await leadsResponse.json();
        const contactsData = await contactsResponse.json();

        const combinedData = leadsData.map((lead) => {
          const leadContacts = contactsData.filter((contact) =>
            contact.leadNumbers?.includes(lead.leadNumber)
          );
          return { ...lead, contacts: leadContacts };
        });

        setData({
          leads: leadsData,
          contacts: contactsData,
          combinedData,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData((prevState) => ({
          ...prevState,
          loading: false,
          error: error.message,
        }));
      }
    };

    fetchData();
  }, [page, rowsPerPage]);

  return {data, totalCount};
};

export { useFetchLeadsAndContacts };
