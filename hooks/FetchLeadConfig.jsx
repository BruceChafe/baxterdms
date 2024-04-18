import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'leadConfig', 'configData');
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          throw new Error("Document does not exist!");
        }
  
        const leadConfig = docSnap.data();
        setConfig({
          sourceOptions: leadConfig.leadSourceActive || [],
          typeOptions: leadConfig.leadTypeActive || [],
          dealershipOptions: leadConfig.leadDealershipActive || [],
          statusOptions: leadConfig.leadStatusActive || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching config from Firestore:", error);
        setConfig((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to fetch configuration from Firestore: " + error.message,
        }));
      }
    };
  
    fetchData();
  }, []);
  

  return { ...config };
};

export { useFetchLeadConfig };
