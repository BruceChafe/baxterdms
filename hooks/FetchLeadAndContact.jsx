import { useState, useEffect } from "react";

function useFetchLeadAndContact(leadNumber) {
  const [data, setData] = useState({
    lead: null, // Assuming these should be singular entities based on usage
    contact: null,
    primaryEmail: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setData(prev => ({ ...prev, loading: true })); // Explicitly set loading to true at the start of a fetch operation
      try{
        const leadResponse = await fetch(
          `https://api.jsonbin.io/v3/b/66118931e41b4d34e4e046b7`,
          {
            headers: {
              'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
            }
          });
        const contactResponse = await fetch(
          `https://api.jsonbin.io/v3/b/66118912acd3cb34a8346f91`,
          {
            headers: {
              'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
            }
          });

        if (!leadResponse.ok || !contactResponse.ok) {
          throw new Error("Failed to fetch data from JSONBin");
        }

        const leadResult = await leadResponse.json();
        console.log("leadResult", leadResult)
        const contactResult = await contactResponse.json();
        console.log("contactResult", contactResult)


        const leadData = leadResult.record.leads.find(lead => lead.leadNumber === parseInt(leadNumber, 10));
        const contactData = contactResult.record.contacts.find(contact => contact.leadNumbers && contact.leadNumbers.includes(parseInt(leadNumber, 10)));

        setData({
          lead: leadData || null,
          contact: contactData || null,
          primaryEmail: contactData?.primaryEmail || null,
          loading: false,
          error: null,
        });
        console.log("Lead Data", leadData),
        console.log("Contact Data", contactData)
      } catch (error) {
        setData((prev) => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchData();
  }, [leadNumber]);

  return { ...data };
}

export { useFetchLeadAndContact };
