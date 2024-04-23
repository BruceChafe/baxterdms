import { useState, useEffect } from "react";
import { db } from "../src/firebase";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";

const useFetchLeadAndContact = (leadId) => {
  const [data, setData] = useState({
    lead: null,
    contact: null,
    primaryEmail: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!leadId) {
      setData({ ...data, loading: false, error: "No lead ID provided" });
      return;
    }

    const fetchData = async () => {
      setData((prev) => ({ ...prev, loading: true }));

      try {
        const leadRef = doc(db, "leads", leadId);
        const leadSnap = await getDoc(leadRef);

        if (!leadSnap.exists()) {
          throw new Error("Lead not found");
        }

        const leadData = {
          id: leadSnap.id,
          ...leadSnap.data(),
        };

        const contactQuery = query(
          collection(db, "contacts"),
          where("leadIDs", "array-contains", leadId)
        );
        const contactSnapshot = await getDocs(contactQuery);

        if (contactSnapshot.empty) {
          throw new Error("Contact not found");
        }

        const contactData = {
          id: contactSnapshot.docs[0].id,
          ...contactSnapshot.docs[0].data(),
        };

        const primaryEmail = contactData.primaryEmail || null;

        setData({
          lead: leadData,
          contact: contactData,
          primaryEmail: primaryEmail,
          loading: false,
          error: null,
        });
      } catch (error) {
        setData((prev) => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchData();
  }, [leadId]);

  const setContact = (newContact) => {
    setData((prevData) => ({
      ...prevData,
      contact: newContact,
    }));
  };

  return { ...data, setContact };
};

export { useFetchLeadAndContact };
