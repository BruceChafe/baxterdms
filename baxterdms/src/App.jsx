import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Grid, CssBaseline, Container } from "@mui/material";
import Contact from "./components/contacts/Contact";
import SignIn from "./components/signin/SignIn";
import NewContact from "./components/contacts/NewContact";
import ContactTable from "./components/contacts/Contacts";
import { AuthProvider } from "./context/AuthContext";
import ThemeSelection from "./components/account/Theme";
import { AccountOverview, AccountTiles } from "./components/account/Overview";
import SidebarSwitcher from "./components/sidebar/SidebarSwitcher";
import UserProfile from "./components/account/PersonalInfo";
import UpdatePassword from "./components/account/UpdatePassword";
import Vehicles from "./components/vehicles/Vehicles";
import AddVehicle from "./components/vehicles/AddVehicle";
import LeadsPage from "./components/leads/Leads";
import LeadComponent from "./components/leads/Lead";
import NewLeadComponent from "./components/leads/NewLead";
import { ThemeProvider } from "./context/ThemeContext";
import ConfigLanding from "./components/configuration/ConfigLanding";
import LeadsConfig from "./components/configuration/LeadsConfig";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <CssBaseline />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route
              path="*"
              element={
                <Grid container>
                  <Grid item>
                    <SidebarSwitcher />
                  </Grid>
                  <Grid item lg={10}>
                    <Container maxWidth="false">
                      <Routes>
                        <Route
                          path="/contacts/:contactId/*"
                          element={<Contact />}
                        />
                        <Route path="/contacts/*" element={<ContactTable />} />
                        <Route
                          path="/contacts/newcontact"
                          element={<NewContact />}
                        />
                        <Route
                          path="/account/overview"
                          element={
                            <AccountOverview
                              navigationLinks={
                                AccountTiles.userDetails.navigationLinks
                              }
                            />
                          }
                        />
                        <Route
                          path="/account/theme"
                          element={<ThemeSelection />}
                        />
                        <Route
                          path="/account/userprofile"
                          element={<UserProfile />}
                        />
                        <Route
                          path="/account/updatepassword"
                          element={<UpdatePassword />}
                        />
                        <Route path="/vehicles/*" element={<Vehicles />} />
                        <Route path="/vehicles/add" element={<AddVehicle />} />
                        <Route path="/leads" element={<LeadsPage />} />
                        <Route
                          path="/leads/newlead"
                          element={<NewLeadComponent />}
                        />
                        <Route
                          path="/leads/lead/:leadId"
                          element={<LeadComponent />}
                        />

                        <Route
                          path="/configuration"
                          element={<ConfigLanding />}
                        />
                        <Route
                          path="/configuration/leads"
                          element={<LeadsConfig />}
                        />
                      </Routes>
                    </Container>
                  </Grid>
                </Grid>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
