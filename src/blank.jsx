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
        const contactsResponse = await fetch(`https://api.jsonbin.io/v3/b/66118912acd3cb34a8346f91`, {
          headers: {
            'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu' 
          }
        });

        const contactsResult = await contactsResponse.json();

        const contactsData = contactsResult.record.contacts;

        const startIndex = page * rowsPerPage;
        const paginatedContacts = contactsData.slice(startIndex, startIndex + rowsPerPage);
  
        setData({
          contacts: paginatedContacts,
          loading: false,
          error: null,
        });
        setTotalCount(contactsData.length);
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