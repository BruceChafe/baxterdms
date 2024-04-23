import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebase";

const useFetchLeadVehicle = (vehicleId) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadVehicle = async () => {
      setLoading(true);
      setError("");

      try {
        const vehicleRef = doc(db, "preOwnedVehicleInventory", vehicleId);
        const docSnap = await getDoc(vehicleRef);

        if (docSnap.exists()) {
          setVehicle({ id: docSnap.id, ...docSnap.data() });
          console.log(vehicle)

        } else {
          setError("No vehicle found with that ID.");
          setVehicle(null);
        }
      } catch (error) {
        console.error("Error fetching lead vehicle:", error);
        setError(`Failed to fetch lead vehicle: ${error.toString()}`);  // Change how the error is reported
      } finally {
        setLoading(false);
      }
    };

    fetchLeadVehicle();
  }, [vehicleId]);

  return { vehicle, loading, error };
};

export { useFetchLeadVehicle };
