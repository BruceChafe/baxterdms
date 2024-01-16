import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {
  Grid,
  CssBaseline,
  Container,
} from '@mui/material';

import SignIn from './components/signin/SignIn';

import NewContact from './components/crm/NewContact';
import ContactTable from './components/crm/Contacts';

import AuthContext from './context/AuthContent';
import { ThemeProvider } from './context/ThemeContext';
import ThemeSelection from './components/account/Theme';
import AccountOverview from './components/account/Overview';

import NavigationSidebar from './components/sidebar/NavigationSidebar';
import AccountSideBar from './components/sidebar/AccountSidebar';
import CRMSidebar from './components/sidebar/CRMSidebar';

const App = () => {
  return (
    <AuthContext>
      <ThemeProvider>
        <Router>
          <CssBaseline />
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route
              path='*'
              element={
                <Grid container>
                  <Grid item>
                    <CRMSidebar />
                  </Grid>
                  <Grid item lg>
                    <Container maxWidth="false">
                      <Routes>
                        <Route path='/crm/contacts' element={<ContactTable />} />
                        <Route path='/crm/newcontact' element={<NewContact />} />
                        <Route path='/account/overview' element={<AccountOverview />} />
                        <Route path='/account/theme' element={<ThemeSelection />} />
                      </Routes>
                    </Container>
                  </Grid>
                </Grid>
              }
            />
          </Routes>

        </Router>
      </ThemeProvider>
    </AuthContext>
  );
};

export default App;
