import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Grid,
  CssBaseline,
  Container,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import Contact from "./components/contacts/Contact";
import SignIn from "./components/signin/SignIn";
import NewContact from "./components/crm/NewContact";
import ContactTable from "./components/contacts/Contacts";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeSelection from "./components/account/Theme";
import { AccountOverview, AccountTiles } from "./components/account/Overview";
import SidebarSwitcher from "./components/sidebar/SidebarSwitcher";
import UserProfile from "./components/account/PersonalInfo";
import UpdatePassword from "./components/account/UpdatePassword";
import Vehicles from "./components/vehicles/Vehicles";
import AddVehicle from "./components/vehicles/AddVehicle";

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
                  <Grid item lg>
                    <Container maxWidth="false">
                      <Routes>
                        {/* <Route path="/home" element={<Home />} /> */}
                        <Route
                          path="/contacts/:contactId/*"
                          element={
                            <Contact
                              contact
                              showPanel
                              onClose={onclick}
                              navigationLinks
                            />
                          }
                        />
                        <Route
                          path="/contacts/*"
                          element={<ContactTable />}
                        />
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
                        <Route
                          path="/vehicles/*"
                          element={<Vehicles />}
                        />
                        <Route
                          path="/vehicles/add"
                          element={<AddVehicle />}
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
