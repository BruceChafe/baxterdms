import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Grid, CssBaseline, Container } from "@mui/material";
import Contact from "./components/customers/Customer";
import SignIn from "./components/signin/SignIn";
import NewContact from "./components/customers/NewCustomer";
import ContactTable from "./components/customers/Customers";
import { AuthProvider } from "./context/AuthContext";
import ThemeSelection from "./components/account/Theme";
import { AccountOverview, AccountTiles } from "./components/account/Overview";
import SidebarSwitcher from "./components/sidebar/SidebarSwitcher";
import UserProfile from "./components/account/PersonalInfo";
import UpdatePassword from "./components/account/UpdatePassword";
import Vehicles from "./components/vehicles/Vehicles";
import AddVehicle from "./components/vehicles/AddVehicle";
import LeadsTable from "./components/leads/Leads";
import LeadComponent from "./components/leads/Lead";
import NewLeadComponent from "./components/leads/NewLead";
import { ThemeProvider } from "./context/ThemeContext";
import ConfigLanding from "./components/configuration/ConfigLanding";
import LeadsConfig from "./components/configuration/LeadsConfig";
import InventoryVehicle from "./components/inventory/InventoryVehicle";
import InventoryVehicles from "./components/tables/DataTable";

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
                  <Grid item xs={2}>
                    <SidebarSwitcher />
                  </Grid>
                  <Grid item xs={10}>
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
                      <Route path="/leads" element={<LeadsTable />} />
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
                      {/* <Route
                          path="/contacts/:contactId/*"
                          element={<Contact />}
                        /> */}
                      <Route
                        path="/vehicleinventory/*"
                        element={<InventoryVehicles />}
                      />
                      {/* <Route
                          path="/vehicleinventory/add"
                          element={<Vehicle />}
                        /> */}
                    </Routes>
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
