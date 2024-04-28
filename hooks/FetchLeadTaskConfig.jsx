import { useState, useEffect, useCallback } from "react";
import { db } from "../src/firebase";
import { doc, getDoc } from "firebase/firestore";

const useFetchLeadTaskConfig = () => {
  const [config, setConfig] = useState({
    leadTaskActivityOptions: [],
    leadTaskPriorityOptions: [],
    leadTaskStatusOptions: [],
    leadTaskTypeOptions: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setConfig(prev => ({ ...prev, loading: true, error: null }));
      const docRef = doc(db, 'leadTaskConfig', 'leadTaskConfig');
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Configuration data not found.");
      }

      const data = docSnap.data();
      console.log("data", data)
      setConfig({
        leadTaskPriorityOptions: data.leadTaskPriorityActive || [],
        leadTaskStatusOptions: data.leadTaskStatusActive || [],
        leadTaskTypeOptions: data.leadTaskTypeActive || [], //
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching config:", error);
      setConfig({
        leadTaskPriorityOptions: [],
        leadTaskStatusOptions: [],
        leadTaskTypeOptions: [],
        loading: false,
        error: "Failed to fetch configuration: " + error.message,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...config,
    refetch: fetchData,
  };
}

export { useFetchLeadTaskConfig };
