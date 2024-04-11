import { useState, useEffect } from "react";

const useFetchContacts = (page, rowsPerPage) => {
  const [data, setData] = useState({
    contacts: [],
    loading: true,
    error: null,
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `/api/contacts`;
        const contactsResponse = await fetch(url);

        if (!contactsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const contactsResult = await contactsResponse.json();
        setData({
          contacts: contactsResult.contacts,
          loading: false,
          error: null,
        });
        setTotalCount(contactsResult.totalCount);
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

export { useFetchContacts };
