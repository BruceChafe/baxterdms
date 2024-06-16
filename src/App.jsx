import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, Grid, CircularProgress, Box } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Contact from "./components/contacts/Contact";
import SignIn from "./components/signin/SignIn";
import NewContact from "./components/contacts/NewContact";
import ContactsDashboard from "./components/contacts/ContactsDashboard";
import UserThemeSelection from "./components/account/UserThemeSelection";
import AccountOverview from "./components/account/Overview";
import SidebarSwitcher from "./components/sidebar/SidebarSwitcher";
import UpdatePassword from "./components/account/UpdatePassword";
import LeadsDashboard from "./components/leads/LeadsDashboard";
import NewLeadComponent from "./components/leads/NewLead";
import { ThemeProvider } from "./context/ThemeContext";
import ConfigLanding from "./components/configuration/ConfigDashboard";
import LeadsConfig from "./components/configuration/LeadsConfig";
import Lead from "./components/leads/Lead";
import LeadTaskConfig from "./components/configuration/LeadTaskConfig";
import WeeklyCalendar from "./components/calendar/WeeklyCalendar";
import InventoryDashboard from "./components/inventory/InventoryDashboard";
import Inventory from "./components/inventory/Inventory";
import { SnackbarProvider } from "./context/SnackbarContext";
import NewLeadForm from "./components/leads/NewLeadForm";
import DocumentDashboard from "./components/documentArchive/DocumentDashboard";
import LicenseScannerDashboard from "./components/licenseScanner/LicenseScannerDashboard";
import LicenseScannerHistory from "./components/licenseScanner/LicenseScannerHistory";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SnackbarProvider>
          <CssBaseline />
          <Router>
            <AppRoutes />
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (user === undefined) {
    return null;
  }

  return user ? (
    <Grid container>
      <Grid
        item
        xs={collapsed ? 1 : 2}
        md={collapsed ? 1 : 2}
        lg={collapsed ? 1 : 2}
      >
        <SidebarSwitcher collapsed={collapsed} setCollapsed={setCollapsed} />
      </Grid>
      <Grid
        item
        xs={collapsed ? 11 : 10}
        md={collapsed ? 11 : 10}
        lg={collapsed ? 11 : 10}
      >
        <Box sx={{ width: "100%", overflow: "auto" }}>
          <Routes>
            <Route path="/home" element={<WeeklyCalendar />} />
            <Route path="/contacts/:contactId" element={<Contact />} />
            <Route path="/contacts/*" element={<ContactsDashboard />} />
            <Route path="/contacts/newcontact" element={<NewContact />} />
            <Route path="/account/overview" element={<AccountOverview />} />
            <Route path="/account/theme" element={<UserThemeSelection />} />
            {/* <Route path="/account/userprofile" element={<UserProfile />} /> */}
            <Route
              path="/account/updatepassword"
              element={<UpdatePassword />}
            />
            <Route path="/leads" element={<LeadsDashboard />} />
            <Route path="/leads/newlead" element={<NewLeadComponent />} />
            <Route path="/leads/newlead/:contactId" element={<NewLeadForm />} />
            <Route path="/configuration" element={<ConfigLanding />} />
            <Route path="/configuration/leads" element={<LeadsConfig />} />
            <Route path="/configuration/leadtasks" element={<LeadTaskConfig />} />
            <Route path="/leads/:leadNumber" element={<Lead />} />
            <Route path="/inventory" element={<InventoryDashboard />} />
            <Route path="/inventory/:inventoryId" element={<Inventory />} />
            <Route path="/documentarchive" element={<DocumentDashboard />} />
            <Route path="/licensescanner" element={<LicenseScannerDashboard />} />
            <Route path="/licensescanner/history" element={<LicenseScannerHistory />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </Box>
      </Grid>
    </Grid>
  ) : (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default App;