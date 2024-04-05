import { useState, useEffect } from "react";

const useLeadEditor = (lead, onSaveLeadInfo) => {
  const [editedLead, setEditedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEditedLead({ ...lead });
  }, [lead]);

  useEffect(() => {
    const saveEditedLead = async () => {
      try {
        setLoading(true);
        await onSaveLeadInfo(editedLead);
      } catch (error) {
        console.error("Error saving edited lead:", error);
        setError("Failed to save edited lead");
      } finally {
        setLoading(false);
      }
    };

    if (editedLead) {
      saveEditedLead();
    }
  }, [editedLead, onSaveLeadInfo]);

  return { editedLead, handleDropdownChange, loading, error };
};

export { useLeadEditor };
