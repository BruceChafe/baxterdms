import { useState, useEffect } from "react";

const useFetchLeadEmails = (leadNumber) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadEmails = async () => {
      try {
        setLoading(true);   
        setError("");

        const response = await fetch(
          `http://localhost:8000/emails/?leadNumber=${leadNumber}`
        );

        const leadEmailData = await response.json();

        setEmails(leadEmailData);
      } catch (error) {
        console.error("Error fetching lead emails:", error);
        setError("Failed to fetch lead emails");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadEmails();
  }, []);

  return {emails, loading, error };
};

export { useFetchLeadEmails };
