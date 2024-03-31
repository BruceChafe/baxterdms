import React, { useState } from "react";
import { Box, Paper, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const TabbedLayout = ({ tabs }) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
  
    <Box sx={{ mt: 3 }}>
      <TabContext value={value}>
        <Paper sx={{ pl: 1, pr: 1 }}>
          <Box mb={1} mt={1} p={1}>
            <TabList onChange={handleChange} textColor="secondary" indicatorColor="secondary">
              {tabs.map((tab, index) => (
                <Tab label={tab.label} value={String(index + 1)} key={index} />
              ))}
            </TabList>
          </Box>
        </Paper>
        {tabs.map((tab, index) => (
          <TabPanel value={String(index + 1)} key={index}>
            {tab.component()}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default TabbedLayout;
