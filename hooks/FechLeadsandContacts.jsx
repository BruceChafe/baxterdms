import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../src/firebase';

const useFetchLeadsAndContacts = (page, rowsPerPage) => {
  const [data, setData] = useState({
    leads: [],
    contacts: [],
    combinedData: [],
    loading: true,
    error: null,
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchLeadsAndContacts = async () => {
      setData(prev => ({ ...prev, loading: true }));
      try {
        // Fetch leads
        const leadsQuery = query(collection(db, "leads"));
        const leadsSnapshot = await getDocs(leadsQuery);
        const leads = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        // Fetch contacts
        const contactsQuery = query(collection(db, "contacts"));
        const contactsSnapshot = await getDocs(contactsQuery);
        const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        console.log("Leads:", leads); // Debug
        console.log("Contacts:", contacts); // Debug
    
        // Combine data
        const startIndex = page * rowsPerPage;
        const paginatedLeads = leads.slice(startIndex, startIndex + rowsPerPage);
        const combinedData = paginatedLeads.map(lead => {
          const leadContacts = contacts.filter(contact => contact.leadIDs?.includes(lead.id));
          return { lead, contacts: leadContacts };
        });
    
        setData({
          leads: paginatedLeads,
          contacts: contacts,
          combinedData: combinedData,
          loading: false,
          error: null,
        });
        setTotalCount(leads.length);
      } catch (err) {
        console.error("Fetching error:", err); // Debug
        setData(prev => ({ ...prev, loading: false, error: `Failed to fetch data: ${err.message}` }));
      }
    };    

    fetchLeadsAndContacts();
  }, [page, rowsPerPage]);

  return { data, totalCount };
};

export { useFetchLeadsAndContacts };
