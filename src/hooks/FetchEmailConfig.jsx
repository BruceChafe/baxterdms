import { useState, useEffect } from "react";

const useFetchEmailConfig = (leadNumber) => {
  const [emailConfig, setEmailConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmailConfig = async () => {
      try {
        setLoading(true);   
        setError("");

        const response = await fetch(
          `http://localhost:8000/emailconfig`
        );

        const emailConfigData = await response.json();

        setEmailConfig(emailConfigData);
      } catch (error) {
        console.error("Error fetching email config:", error);
        setError("Failed to fetch email config");
      } finally {
        setLoading(false);
      }
    };

    fetchEmailConfig();
  }, []);

  return { emailConfig, setEmailConfig, loading, error };
};

export { useFetchEmailConfig };
