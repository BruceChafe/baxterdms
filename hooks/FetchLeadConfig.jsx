import { useState, useEffect, useCallback } from "react";
import { db } from "../src/firebase";
import { doc, getDoc } from "firebase/firestore";

const useFetchLeadConfig = () => {
  const [config, setConfig] = useState({
    sourceOptions: [],
    typeOptions: [],
    dealershipOptions: [],
    statusOptions: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setConfig(prev => ({ ...prev, loading: true }));
    try {
      const docRef = doc(db, 'leadConfig', 'configData');
      const docSnap = await getDoc(docRef);
  
      if (!docSnap.exists()) {
        throw new Error("Configuration data not found.");
      }
  
      const data = docSnap.data();
      setConfig({
        sourceOptions: data.leadSourceActive || [],
        typeOptions: data.leadTypeActive || [],
        dealershipOptions: data.leadDealershipActive || [],
        statusOptions: data.leadStatusActive || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      setConfig({
        sourceOptions: data.leadSourceActive || [],
        typeOptions: data.leadTypeActive || [],
        dealershipOptions: data.leadDealershipActive || [],
        statusOptions: data.leadStatusActive || [],
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

export { useFetchLeadConfig };
