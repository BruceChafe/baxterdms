import { useState, useEffect } from 'react';

const useFetchContact = (contactId) => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContactData = async () => {
      if (!contactId) {
        setContact(null);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `https://api.jsonbin.io/v3/b/66118912acd3cb34a8346f91`,
          {
            headers: {
              'X-Master-Key': '$2a$10$uiM2HEeI3BGhlOa7g8QsAO69Q1wi2tcxKz5wZeKXnvO0MSmUIY/Pu'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }

        const data = await response.json();
        const contacts = data.record.contacts;
        const contactData = contacts.find(contact => contact.id === parseInt(contactId, 10));

        if (contactData) {
          setContact(contactData);
        } else {
          throw new Error(`Contact with id=${contactId} not found`);
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
        setError(`Failed to fetch contact. ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [contactId]);

  return { contact, loading, error };
};

export { useFetchContact };
