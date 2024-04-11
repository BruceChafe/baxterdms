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
        const contactsResponse = await fetch(url);

        if (!contactsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const contactsResult = await contactsResponse.json();
        console.log("results", contactsResult)
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
      }
    };

    fetchData();
  }, []);

  return { data };
};

export { useFetchContacts };
