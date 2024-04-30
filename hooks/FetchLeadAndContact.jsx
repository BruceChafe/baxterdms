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
    vehicle: null,
    primaryEmail: null,
    loading: true,
    error: null,
  });

  const [reload, setReload] = useState(false);

  const refetch = () => setReload(prev => !prev);

  useEffect(() => {
    async function fetchData() {
      setData(prev => ({ ...prev, loading: true }));
      try {
        const leadRef = doc(db, "leads", leadId);
        const leadSnap = await getDoc(leadRef);
        if (!leadSnap.exists()) throw new Error("Lead not found");

        const leadData = { id: leadSnap.id, ...leadSnap.data() };
        const contactQuery = query(collection(db, "contacts"), where("leadIDs", "array-contains", leadId));
        const contactSnapshot = await getDocs(contactQuery);
        if (contactSnapshot.empty) throw new Error("Contact not found");

        const contactData = { id: contactSnapshot.docs[0].id, ...contactSnapshot.docs[0].data() };
        const primaryEmail = contactData.primaryEmail || null;

        let vehicles = [];
        if (leadData.vehicleIDs && leadData.vehicleIDs.length > 0) {
          const vehiclePromises = leadData.vehicleIDs.map(vehicleId => getDoc(doc(db, "preOwnedVehicleInventory", vehicleId)));
          const vehicleDocs = await Promise.all(vehiclePromises);
          vehicles = vehicleDocs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        setData({ lead: leadData, contact: contactData, vehicle: vehicles, primaryEmail, loading: false, error: null });
      } catch (error) {
        console.error("Fetch failed:", error);
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    }

    fetchData();
  }, [leadId, reload]);

  return { ...data, refetch, setData };
};

export { useFetchLeadAndContact}