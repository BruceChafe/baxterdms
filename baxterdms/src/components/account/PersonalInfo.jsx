import React from "react";
import UserData from "./UserData";

const UserProfile = () => {
  return (
    <UserData>
      {(userDetails) =>
        userDetails && (
          <div>
            <p>{`First Name: ${userDetails.firstName}`}</p>
            <p>{`Last Name: ${userDetails.lastName}`}</p>
          </div>
        )
      }
    </UserData>
  );
};

export default UserProfile;
