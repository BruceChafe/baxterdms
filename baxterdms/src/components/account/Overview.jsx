import React, { useState } from "react";
import {
  Grid,
  Card,
  Typography,
  CardContent,
  Link as MuiLink,
  Modal,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  Divider,
  ListItemButton,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import DevicesIcon from "@mui/icons-material/Devices";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { Link } from "react-router-dom";
import UserData from "./UserData";

const AccountTiles = {
  userDetails: {
    navigationLinks: [
      {
        text: "Personal Info",
        icon: <AccountCircleIcon />,
        description:
          "Access and manage detailed information about your personal profile and user details.",
        to: "/account/userprofile",
      },
      {
        text: "Password Managment",
        icon: <LockIcon />,
        description:
          "Securely update and manage your account password for enhanced security.",
        to: "/account/updatepassword",
      },
      {
        text: "Theme Selection",
        icon: <DevicesIcon />,
        description:
          "Choose between dark and light modes to personalize the appearance of your user interface.",
        to: "/account/theme",
      },
      // {
      //   text: "Organizations",
      //   icon: <CorporateFareIcon />,
      //   description:
      //     "Explore and manage your affiliations with different user organizations within the system.",
      //   to: "/account/overview",
      //   color: "white",
      // },
      // {
      //   text: "Notification Prefrences",
      //   icon: <SubscriptionsIcon />,
      //   description:
      //     "Customize your notification settings based on your preferences for updates and alerts.",
      //   to: "/crm/newcontact",
      //   color: "white",
      // },
      // {
      //   text: "Training Resources",
      //   icon: <SettingsIcon />,
      //   description:
      //     "Access additional settings and resources related to training and user support",
      //   to: "/account/overview",
      //   color: "white",
      // },
      // {
      //   text: "Security Settings",
      //   icon: <SettingsIcon />,
      //   description:
      //     "Configure and customize security settings to ensure the safety of your account.",
      //   to: "/account/overview",
      //   color: "white",
      // },
    ],
  },
};

const AccountOverview = ({ navigationLinks }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
  });

  const handleEditClick = () => {
    setIsModalOpen(true);
    setEditedProfile({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", editedProfile);
    handleModalClose();
  };

  return (
    <UserData>
      {(userDetails) =>
        userDetails && (
          <div style={{ display: "flex" }}>
            <Card
              sx={{
                mt: 5,
                mr: 2,
                mb: 35,
                pt: 5,
                pb: 3,
                width: { xs: "100%", sm: "100%", md: "25%" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex" }}>
                  <List>
                    <ListItem>
                      <Typography variant="h4">
                        {`${userDetails.firstName} ${userDetails.lastName}`}
                        <br />
                        <Divider />
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="h6" color="textSecondary">
                        {`${userDetails.jobTitle}`}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="h7" color="textSecondary">
                        {`${userDetails.companyName}`}
                      </Typography>
                    </ListItem>

                    <ListItem>
                      <Typography variant="body2" color="textSecondary">
                        {`${userDetails.primaryEmail}`}
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body2" color="textSecondary">
                        {`${userDetails.companyNumber}`}
                      </Typography>
                    </ListItem>
                  </List>
                </Box>
              </CardContent>
            </Card>
            <Grid
              container
              item
              style={{ display: "inline-flex", flexWrap: "wrap" }}
            >
              {navigationLinks &&
                navigationLinks.map((link, index) => (
                  <Grid item key={index} xs={12} md={4}>
                    <Card
                      sx={{ mt: 5, ml: 2, mr: 2, pt: 3, pb: 1 }}
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {link.text}
                        </Typography>
                        {link.icon}
                        <Typography
                          sx={{ mt: 2, mb: 1 }}
                          variant="body2"
                          color="textSecondary"
                        >
                          {link.description}
                        </Typography>
                        <Typography
                          sx={{ mt: 2, mb: 1 }}
                          variant="body2"
                          color="textSecondary"
                        >
                          <MuiLink
                            component={Link}
                            to={link.to}
                            color="inherit"
                          >
                            Update Info &gt;
                          </MuiLink>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </div>
        )
      }
    </UserData>
  );
};

export { AccountOverview, AccountTiles };
