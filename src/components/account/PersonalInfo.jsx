import React from "react";
import UserData from "./UserData";
import { Paper } from "@mui/material";

const UserProfile = () => {
  return (
    <Paper
      sx={{
        mt: 5,
        mr: 2,
        p: 10,
      }}
    >
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
    </Paper>
  );
};

export default UserProfile;
