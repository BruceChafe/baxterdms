import React from "react";
import { Grid, Card, Typography } from "@mui/material";

const AccountTiles = {
  userDetails: {
    navigationLinks: [
      { text: "CRM", to: "/crm/newcontact", color: "white" },
      { text: "Account Overview", to: "/account/overview", color: "white" },
    ],
  },
  theme: {
    navigationLinks: [
      { text: "Theme", to: "/crm/newcontact", color: "white" },
      { text: "Account Overview", to: "/account/overview", color: "white" },
    ],
  },
};

const AccountOverview = ({ navigationLinks }) => {
  return (
    <Grid container>
      {navigationLinks &&
        navigationLinks.map((link, index) => (
          <Grid item md={3} key={index}>
            <Card style={{ margin: "20px" }}>
              <Typography style={{ margin: "20px" }}>{link.text}</Typography>
            </Card>
          </Grid>
        ))}
    </Grid>
  );
};

export { AccountOverview, AccountTiles };
