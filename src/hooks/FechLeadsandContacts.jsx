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
      try {
        const leadsResponse = await fetch(`https://api.jsonbin.io/v3/b/66118931e41b4d34e4e046b7`, {
          headers: {
            'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
          }
        });
        const contactsResponse = await fetch(`https://api.jsonbin.io/v3/b/66118912acd3cb34a8346f91`, {
          headers: {
            'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu' 
          }
        });

        if (!leadsResponse.ok || !contactsResponse.ok) {
          throw new Error("Failed to fetch data from JSONBin");
        }

        const leadsResult = await leadsResponse.json();
        const contactsResult = await contactsResponse.json();

        const leadsData = leadsResult.record.leads;
        const contactsData = contactsResult.record.contacts;

        const startIndex = page * rowsPerPage;
        const paginatedLeads = leadsData.slice(startIndex, startIndex + rowsPerPage);
        
        const combinedData = paginatedLeads.map((lead) => {
          const leadContacts = contactsData.filter((contact) =>
            contact.leadNumbers?.includes(lead.leadNumber)
          );
          return { ...lead, contacts: leadContacts };
        });

        setData({
          leads: paginatedLeads,
          contacts: contactsData,
          combinedData,
          loading: false,
          error: null,
        });
        setTotalCount(leadsData.length);
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

  return { data, totalCount };
};

export { useFetchLeadsAndContacts };
