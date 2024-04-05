import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline, Grid } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Contact from "./components/contacts/Contact";
import SignIn from "./components/signin/SignIn";
import NewContact from "./components/contacts/NewContact";
import ContactTable from "./components/contacts/Contacts";
import UserThemeSelection from "./components/account/UserThemeSelection";
import AccountOverview from "./components/account/Overview";
import SidebarSwitcher from "./components/sidebar/SidebarSwitcher";
import UserProfile from "./components/account/PersonalInfo";
import UpdatePassword from "./components/account/UpdatePassword";
import LeadsTable from "./components/leads/Leads";
import LeadComponent from "./components/leads/Lead";
import NewLeadComponent from "./components/leads/NewLead";
import { ThemeProvider } from "./context/ThemeContext";
import ConfigLanding from "./components/configuration/ConfigLanding";
import LeadsConfig from "./components/configuration/LeadsConfig";
import Lead from "./components/leads/Lead";
import LeadTaskConfig from "./components/configuration/LeadTaskConfig";
import WeeklyCalendar from "./components/calendar/WeeklyCalendar";
import InventoryDashboard from "./components/inventory/InventoryDashboard";
import Inventory from "./components/inventory/Inventory";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }
  if (user === undefined) {
    return null;
  }

  return user ? (
<Grid container>
  <Grid item xs={12} md={3} lg={2}> {/* Sidebar */}
    <SidebarSwitcher />
  </Grid>
  <Grid item xs={12} md={9} lg={10} > 
        <Routes>
          <Route path="/*" element={<WeeklyCalendar />} />
          <Route
            path="/contacts/:contactId/*"
            element={<Navigate to={`/contacts/:contactId`} target="_blank" />}
          />
          <Route path="/contacts/*" element={<ContactTable />} />
          <Route path="/contacts/newcontact" element={<NewContact />} />
          <Route
            path="/account/overview"
            element={
              <AccountOverview />
            }
          />
          <Route path="/account/theme" element={<UserThemeSelection />} />
          <Route path="/account/userprofile" element={<UserProfile />} />
          <Route path="/account/updatepassword" element={<UpdatePassword />} />
          <Route path="/leads" element={<LeadsTable />} />
          <Route path="/leads/newlead" element={<NewLeadComponent />} />
          <Route path="/leads/lead/:leadId" element={<LeadComponent />} />
          <Route path="/configuration" element={<ConfigLanding />} />
          <Route path="/configuration/leads" element={<LeadsConfig />} />
          <Route path="/configuration/leadtasks" element={<LeadTaskConfig />} />
          <Route path="/contacts/:contactId" element={<Contact />} />
          <Route path="/leads/:leadNumber" element={<Lead />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/inventory/:inventoryId" element={<Inventory />} />

        </Routes>
      </Grid>
    </Grid>
  ) : (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      {/* <Route path="*" element={<Navigate to="/signin" />} /> */}
    </Routes>
  );
};

export default App;