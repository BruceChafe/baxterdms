import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchTasksForWeek = (dates, refetchTrigger) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasksForWeek = async () => {
      if (!dates || dates.length < 2) {
        setError("Invalid date range provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const startDate = dates[0].start;
        const endDate = dates[dates.length - 1].end;

        const tasksRef = collection(db, "leadTasks");
        const tasksQuery = query(
          tasksRef,
          where("followUpDate", ">=", startDate),
          where("followUpDate", "<=", endDate)
        );

        const querySnapshot = await getDocs(tasksQuery);
        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setTasks(tasksData);
        console.log(tasksData)
      } catch (error) {
        setError(`Error fetching tasks for the week: ${error.message}`);
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasksForWeek();
  }, [dates, refetchTrigger]);

  return { tasks, loading, error };
};

export { useFetchTasksForWeek };
