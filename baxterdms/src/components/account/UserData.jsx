import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserData = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/users?UID=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setUserDetails(data[0]);
          } else {
            setUserDetails(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          setUserDetails(null);
        });
    }
  }, [user]);

  return <>{children(userDetails)}</>;
};

export default UserData;
