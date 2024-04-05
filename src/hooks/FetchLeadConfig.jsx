import { useState, useEffect } from "react";

const useFetchLeadConfig = () => {
  const [config, setConfig] = useState({
    sourceOptions: [],
    typeOptions: [],
    dealershipOptions: [],
    statusOptions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:8000/configLeads/1");
        if (!response.ok) {
          throw new Error("Failed to fetch configuration data");
        }

        const configData = await response.json();

        setConfig({
          sourceOptions: configData.leadSourceActive || [],
          typeOptions: configData.leadTypeActive || [],
          dealershipOptions: configData.leadDealershipActive || [],
          statusOptions: configData.leadStatusActive || [],
        });
      } catch (error) {
        console.error("Error fetching config:", error.message);
        setError("Failed to fetch configuration");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { ...config, loading, error };
};

export { useFetchLeadConfig };
