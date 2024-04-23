import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../src/firebase";

const removeVehicleFromLead = async (leadId, vehicleId) => {
  if (!leadId || !vehicleId) {
    console.error("Invalid lead or vehicle ID");
    return;
  }

  try {
    console.log("Lead ID:", leadId, "Vehicle ID:", vehicleId);
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      vehicleIDs: arrayRemove(vehicleId),
    });
    console.log("Vehicle removed successfully");
  } catch (error) {
    console.error("Error removing vehicle:", error);
  }
};

export { removeVehicleFromLead };
