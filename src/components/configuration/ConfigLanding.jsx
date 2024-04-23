import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import TabbedLayout from "../layouts/TabbedLayout";
import TitleLayout from "../layouts/TitleLayout";
import LeadTaskConfig from "./LeadTaskConfig";
import LeadsConfig from "./LeadsConfig";
import EmailServerConfig from "./EmailServerConfig";

const ConfigLanding = () => {
  return (
    <Box sx={{ mt: 3, mr: 8 }}>
    <TitleLayout
        title={<Typography variant="h4">Configuration</Typography>}
      />
      <Box>
      <TabbedLayout
        tabs={[
          {
            label: "Lead Task Config",
            component: () => (
              <LeadTaskConfig />
            ),
          },
          {
            label: "Lead Config",
            component: () => (
              <LeadsConfig />
            ),
          },
          {
            label: "Email Server Config",
            component: () => (
              <EmailServerConfig />
            ),
          },
        ]}
      />
      </Box>
    </Box>
  );
};

export default ConfigLanding;
