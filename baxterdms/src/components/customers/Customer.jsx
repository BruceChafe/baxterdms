import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const Contact = () => {
  const { contactId } = useParams(); // Extract id from the URL
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/Contacts/${contactId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        const data = await response.json();
        if (data) {
          setContactData(data);
        } else {
          throw new Error('Contact not found');
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [contactId]);

  return (
    <Typography>
      {loading ? "Loading..." : (contactData ? `Contact Name: ${contactData.firstName}` : "Contact not found")}
    </Typography>
  );
};

export default Contact;