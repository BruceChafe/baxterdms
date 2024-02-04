import React from "react";
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
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import { Link } from "react-router-dom";

const ConfigLanding = () => {
  const adminTiles = [
    {
      text: "Leads",
      description:
        "Access and manage detailed information about your personal profile and user details.",
      to: "/configuration/leads",
    },
    // {
    //   text: "Account Settings",
    //   description: "Manage your account settings and preferences.",
    //   to: "/account/settings",
    // },
    // {
    //   text: "Device Management",
    //   description: "View and manage the devices associated with your account.",
    //   to: "/account/devices",
    // },
    // {
    //   text: "Company Information",
    //   description: "Access details about your company and make updates.",
    //   to: "/account/companyinfo",
    // },
    // {
    //   text: "Subscription Details",
    //   description: "View information about your subscription.",
    //   to: "/account/subscriptions",
    // },
  ];

  const renderCard = (tile) => (
    <Grid item key={tile.text} xs={12} sm={6} md={4}>
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
            {tile.text}
          </Typography>
          {/* Add icons based on your preference */}
          {getIcon(tile.text)}
          <Typography sx={{ mt: 2, mb: 1 }} variant="body2" color="textSecondary">
            {tile.description}
          </Typography>
          <Typography sx={{ mt: 2, mb: 1 }} variant="body2" color="textSecondary">
            <MuiLink component={Link} to={tile.to} color="inherit">
              Update Info &gt;
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  const getIcon = (text) => {
    switch (text) {
      case "Personal Info":
        return <AccountCircleIcon />;
      case "Account Settings":
        return <SettingsIcon />;
      case "Device Management":
        return <DevicesIcon />;
      case "Company Information":
        return <CorporateFareIcon />;
      case "Subscription Details":
        return <SubscriptionsIcon />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {adminTiles.map((tile) => renderCard(tile))}
      </Grid>
    </Box>
  );
};

export default ConfigLanding;
