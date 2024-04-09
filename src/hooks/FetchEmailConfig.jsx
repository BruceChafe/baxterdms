import { useState, useEffect } from "react";

const useFetchEmailConfig = () => {
  const [data, setData] = useState({
    emailConfig: {},
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    try {
      const emailConfigResponse = await fetch(`https://api.jsonbin.io/v3/b/661189e4ad19ca34f855fc43`, {
        headers: {
          'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
        }
      });

      const json = await emailConfigResponse.json();
      const emailConfig = json.record;

      setData({
        emailConfig: emailConfig,
        loading: false,
        error: null
      });
    } catch (error) {
      setData((prevState) => ({
        ...prevState,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  return { data, refetch: fetchData };
};

export { useFetchEmailConfig };