import { useState, useEffect } from "react";

const useFetchLeadTasks = (leadNumber) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadTasks = async () => {
      try {
        setLoading(true);   
        setError("");

        const response = await fetch(
          `http://localhost:8000/tasks/?leadNumber=${leadNumber}`
        );

        const leadTaskData = await response.json();

        setTasks(leadTaskData);
      } catch (error) {
        console.error("Error fetching lead tasks:", error);
        setError("Failed to fetch lead tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadTasks();
  }, []);

  return {tasks, loading, error };
};

export { useFetchLeadTasks };
