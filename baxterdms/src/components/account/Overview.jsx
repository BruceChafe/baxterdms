import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import UserData from "./UserData";
import UserProfileInfo from "./UserProfileInfo";
import UserThemeSelection from "./UserThemeSelection";
import UpdatePassword from "./UpdatePassword";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";

const AccountOverview = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <UserData>
      {(userDetails) =>
        userDetails && (
          <>
           <Box sx={{ mt: 3, mr: 8 }}>
            <TitleLayout
              title={<Typography variant="h4">Account Overview</Typography>}
            />
            <TabbedLayout
              tabs={[
                {
                  label: "My Profile",
                  component: () => (
                    <UserProfileInfo userDetails={userDetails} />
                  ),
                },
                {
                  label: "Theme Selection",
                  component: () => (
                    <UserThemeSelection userDetails={userDetails} />
                  ),
                },
                {
                  label: "Password Reset",
                  component: () => <UpdatePassword userDetails={userDetails} />,
                },
              ]}
            />
         </Box>
          </>
        )
      }
    </UserData>
  );
};

export default AccountOverview;
