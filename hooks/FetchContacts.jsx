import { useState, useEffect } from "react";

const useFetchContacts = () => {
  const [data, setData] = useState({
    contacts: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const url = 'https://data.mongodb-api.com/app/data-ohuxb/endpoint/data/v1/action/find';
      const apiKey = 'oueAwOMlIrR7Au2cVdjSvMM9ey319c5GDzbNyTCIJT9E1GIZC7O2kRsiFKzkPgrN';
      const requestBody = {
        collection: "contacts",
        database: "baxterdms",
        dataSource: "baxterDMS"
      };

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify(requestBody)
        });

        console.log(response)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData({
          contacts: result.documents,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setData({
          contacts: [],
          loading: false,
          error: error.message,
        });
      }
    };

    fetchData();
  }, []);

  return { data };
};

export { useFetchContacts };
