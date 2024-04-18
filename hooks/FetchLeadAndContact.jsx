import { useState, useEffect } from "react";
import { db } from "../src/firebase";
 import { doc, getDoc, query, where, getDocs, collection } from "firebase/firestore";

const useFetchLeadAndContact = (leadId) => {
  const [data, setData] = useState({
    lead: null,
    contact: null,
    primaryEmail: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!leadId) {
        setData({ ...data, loading: false, error: "No lead ID provided" });
        return;
      }

      setData(prev => ({ ...prev, loading: true }));

      try {
        // Fetch lead data
        const leadRef = doc(db, "leads", leadId);
        const leadSnap = await getDoc(leadRef);

        if (!leadSnap.exists()) {
          throw new Error("Lead not found");
        }

        const leadData = leadSnap.data();

        // Fetch contact data based on leadId
        const contactQuery = query(
          collection(db, "contacts"),
          where("leadIDs", "array-contains", leadId)
        );

        const contactSnapshot = await getDocs(contactQuery);

        if (contactSnapshot.empty) {
          throw new Error("Contact not found");
        }

        // Assuming there's only one contact per lead for simplicity
        const contactData = contactSnapshot.docs[0].data();

        // Set primaryEmail to null if it's not available
        const primaryEmail = contactData.primaryEmail || null;

        setData({
          lead: leadData,
          contact: contactData,
          primaryEmail: primaryEmail,
          loading: false,
          error: null,
        });

      } catch (error) {
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchData();
  }, [leadId]);

  return { ...data };
};

export { useFetchLeadAndContact };
