import { useState, useEffect } from "react";

const useFetchLeadConfig = () => {
  const [config, setConfig] = useState({
    sourceOptions: [],
    typeOptions: [],
    dealershipOptions: [],
    statusOptions: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.jsonbin.io/v3/b/6611899dacd3cb34a8346fe2", {
          headers: {
            'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch configuration data");
        }

        const configData = await response.json();
        const leadConfig = configData.record.configLeads[0];

        setConfig({
          sourceOptions: leadConfig.leadSourceActive || [],
          typeOptions: leadConfig.leadTypeActive || [],
          dealershipOptions: leadConfig.leadDealershipActive || [],
          statusOptions: leadConfig.leadStatusActive || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching config:", error.message);
        setConfig((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to fetch configuration",
        }));
      }
    };

    fetchData();
  }, []);

  return { ...config };
};

export { useFetchLeadConfig };
