import { useState, useEffect } from "react";

const useFetchContacts = () => {
  const [data, setData] = useState({
    contacts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/contacts`;
        const response = await fetch(url);
        const text = await response.text(); // Get the full response body as text
        console.log("Full response text:", text);
  
        // Try to parse JSON only after logging the text
        const contactsResult = JSON.parse(text);
        setData({
          contacts: contactsResult.contacts,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData((prevState) => ({
          ...prevState,
          loading: false,
          error: error.message,
        }));
        console.error("Error parsing JSON:", error);
      }
    };
  
    fetchData();
  }, []);
  

  return { data };
};

export { useFetchContacts };
