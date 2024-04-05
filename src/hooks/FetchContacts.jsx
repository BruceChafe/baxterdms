import { useState, useEffect } from "react";

const useFetchContacts = (page, rowsPerPage) => {
  const [contacts, setContacts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:8000/Contacts?_start=${startIndex}&_end=${endIndex}`
        );
        const totalCountHeader = response.headers.get("X-Total-Count");
        setTotalCount(parseInt(totalCountHeader, 10) || 0);

        const contactsData = await response.json();

        setContacts(contactsData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError("Failed to fetch contacts");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [page, rowsPerPage]);

  return { contacts, totalCount, loading, error };
};

export { useFetchContacts };
