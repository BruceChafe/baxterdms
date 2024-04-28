import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchLeadTasks = (leadId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadTasks = async () => {
      if (!leadId) {
        setError("No lead ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const tasksRef = collection(db, "leadTasks");
        const q = query(tasksRef, where("leadId", "==", leadId));
        const querySnapshot = await getDocs(q);

        const tasksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          leadTaskFollowUpDate: doc.data().leadTaskFollowUpDate.toDate()
        }));

        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching lead tasks:", error);
        setError(`Failed to fetch lead tasks: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadTasks();
  }, [leadId]);

  return { tasks, loading, error };
};

export { useFetchLeadTasks };
