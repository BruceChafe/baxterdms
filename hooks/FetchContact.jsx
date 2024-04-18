import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchContact = (contactId) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contactId) {
      setContact(null);
      setLoading(false);
      return;
    }

    const fetchContact = async () => {
      setLoading(true);
      const docRef = doc(db, "contacts", contactId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContact({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("No such contact exists!");
          setContact(null);
        }
      } catch (err) {
        setError("Failed to fetch contact: " + err.message);
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  return { contact, setContact, loading, error };
};

export { useFetchContact };
