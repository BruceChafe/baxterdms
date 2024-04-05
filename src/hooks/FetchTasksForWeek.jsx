import { useState, useEffect } from "react";

const useFetchTasksForWeek = (dates, refetchTrigger) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchTasksForWeek = async () => {
        if (!dates || dates.length === 0) {
          setError("No dates provided");
          setLoading(false);
          return;
        }
  
        console.log("Fetching tasks for the week...");
  
        try {
          setLoading(true);
          setError("");
  
          const response = await fetch(`http://localhost:8000/tasks`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const tasksData = await response.json();
  
          setTasks(tasksData);
        } catch (error) {
          setError(`Error fetching tasks for the week: ${error.message}`);
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchTasksForWeek();
    }, [dates, refetchTrigger]);
  
    return { tasks, loading, error };
  };
  

export { useFetchTasksForWeek };
