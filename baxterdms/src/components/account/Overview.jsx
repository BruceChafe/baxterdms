import React from "react";
import {
  Grid,
  Card,
  Typography,
  CardContent,
  CardActionArea,
  Link as MuiLink,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import DevicesIcon from "@mui/icons-material/Devices";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { Link } from "react-router-dom";

const AccountTiles = {
  userDetails: {
    navigationLinks: [
      {
        text: "Overview",
        icon: <AccountCircleIcon />,
        description: "User overview",
        to: "/crm/newcontact",
        color: "white",
      },
      {
        text: "Personal Info",
        icon: <AccountCircleIcon />,
        description:
          "Access and manage detailed information about your personal profile and user details.",
        to: "/account/userprofile",
        color: "white",
      },
      {
        text: "Password Managment",
        icon: <LockIcon />,
        description:
          "Securely update and manage your account password for enhanced security.",
        to: "/crm/newcontact",
        color: "white",
      },
      {
        text: "Security Settings",
        icon: <SettingsIcon />,
        description:
          "Configure and customize security settings to ensure the safety of your account.",
        to: "/account/overview",
        color: "white",
      },
      {
        text: "Theme Selection",
        icon: <DevicesIcon />,
        description:
          "Choose between dark and light modes to personalize the appearance of your user interface.",
        to: "/crm/newcontact",
        color: "white",
      },
      {
        text: "Organizations",
        icon: <CorporateFareIcon />,
        description:
          "Explore and manage your affiliations with different user organizations within the system.",
        to: "/account/overview",
        color: "white",
      },
      {
        text: "Notification Prefrences",
        icon: <SubscriptionsIcon />,
        description:
          "Customize your notification settings based on your preferences for updates and alerts.",
        to: "/crm/newcontact",
        color: "white",
      },
      {
        text: "Training Resources",
        icon: <SettingsIcon />,
        description:
          "Access additional settings and resources related to training and user support",
        to: "/account/overview",
        color: "white",
      },
    ],
  },
};

const AccountOverview = ({ navigationLinks }) => {
  return (
    <Grid container style={{ display: "flex", height: "80vh" }}>
      {navigationLinks &&
        navigationLinks.map((link, index) => (
          <Grid item md={3} key={index}>
            <Card
              style={{
                margin: "20px",
                textAlign: "center",
                height: "80%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {link.icon}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {link.text}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {link.description}
                </Typography>
                <MuiLink component={Link} to={link.to} color="inherit">
                  Update Info &gt;
                </MuiLink>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export { AccountOverview, AccountTiles };
