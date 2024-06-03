import React, { useState } from "react";
import { Box, Paper, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const TabbedLayout = ({ tabs }) => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <TabContext value={value}>
        <Paper sx={{ border: "solid", borderColor: "divider" }}>
          <Box>
            <TabList
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="transparent"
            >
              {tabs.map((tab, index) => (
                <Tab label={tab.label} value={String(index + 1)} key={index} />
              ))}
            </TabList>
          </Box>
        </Paper>
        {tabs.map((tab, index) => (
          <TabPanel
            value={String(index + 1)}
            key={index}
            sx={{
              height: "80vh",
              width: "100%",
            }}
          >
            {tab.component()}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default TabbedLayout;
