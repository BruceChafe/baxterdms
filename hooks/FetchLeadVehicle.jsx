import { useState, useEffect } from "react";

const useFetchLeadVehicle = (leadStockNumber) => {
  const [vehicle, setVehicle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadVehicle = async () => {
      try {
        setLoading(true);   
        setError("");

        const response = await fetch(
          `http://localhost:8000/inventory/?stock=${leadStockNumber}`
        );

        const leadVehicleData = await response.json();

        setVehicle(leadVehicleData);
      } catch (error) {
        console.error("Error fetching lead vehicle:", error);
        setError("Failed to fetch lead vehicle");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadVehicle();
  }, []);

  return {vehicle, loading, error };
};

export { useFetchLeadVehicle };
