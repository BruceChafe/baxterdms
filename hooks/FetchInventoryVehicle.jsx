import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchInventoryVehicle = (inventoryVehicleId) => {
  const [inventoryVehicle, setInventoryVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!inventoryVehicleId) {
      setInventoryVehicle(null);
      setLoading(false);
      return;
    }

    const fetchInventoryVehicle = async () => {
      setLoading(true);
      const docRef = doc(db, "inventoryVehicles", inventoryVehicleId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInventoryVehicle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("No such inventoryVehicle exists!");
          setInventoryVehicle(null);
        }
      } catch (err) {
        setError("Failed to fetch inventoryVehicle: " + err.message);
        setInventoryVehicle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryVehicle();
  }, [inventoryVehicleId]);

  return { inventoryVehicle, setInventoryVehicle, loading, error };
};

export { useFetchInventoryVehicle };
