import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserData = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);
  const [cachedUID, setCachedUID] = useState(null); // Cache the UID

  useEffect(() => {
    // Function to fetch user details
    const fetchUserDetails = async (uid) => {
      try {
        const response = await fetch(`http://localhost:8000/users?UID=${uid}`);
        const data = await response.json();
        if (data && data.length > 0) {
          setUserDetails(data[0]);
          setCachedUID(uid); // Update cache with the new UID
        } else {
          setUserDetails(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserDetails(null);
      }
    };

    // Check if the current UID is different from the cached one
    if (user?.uid !== cachedUID) {
      fetchUserDetails(user?.uid);
    }
  }, [user, cachedUID]); // Depend on user and cachedUID

  return <>{children(userDetails)}</>;
};

export default UserData;
