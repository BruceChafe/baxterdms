<Box sx={{ p: 2, width: "100%", typography: "body1" }}>
    {lead && (
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <TabList onChange={handleChange} centered variant="fullWidth">
              <Tab label="firstName lastName" disabled />
              <Tab label="Lead Information" value="1" />
              <Tab label="Lead Contact" value="2" />
              <Tab label="Lead Vehicle" value="3" disabled />
              <Tab label="Lead Trade-In" value="4" disabled />
            </TabList>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider", pl:3 }}>
            <Typography variant="h6" sx={{mb:10}}>Status</Typography>
          </Box>
          <TabPanel value="1" sx={{ borderBottom: 1, borderColor: "divider"}}>
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Lead Information
              </Typography>
              <TextField
                variant="outlined"
                label="Dealership"
                value={lead.leadDealership}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <TextField
                variant="outlined"
                label="Status"
                value={lead.leadStatus}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <br />
              <TextField
                variant="outlined"
                label="Lead Source"
                value={lead.leadSource}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <TextField
                variant="outlined"
                label="BDC Agent"
                value={lead.leadBDCAgent}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <br />
              <TextField
                variant="outlined"
                label="Lead Type"
                value={lead.leadType}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <TextField
                variant="outlined"
                label="Sales Consultant"
                value={lead.leadSalesConsultant}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <br />
              <TextField
                variant="outlined"
                label="Vehicle of Interest"
                value={lead.leadVehicle}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <TextField
                variant="outlined"
                label="Sales Manager"
                value={lead.leadSalesManager}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <br />
              <TextField
                variant="outlined"
                label="Trade-In"
                value={lead.leadTradeVehicle}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
              <TextField
                variant="outlined"
                label="Finance Manager"
                value={lead.leadFinanceManager}
                disabled
                sx={{ width: "45%", mr: 2, mb: 2 }}
              />
            </>
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      )}
    </Box>