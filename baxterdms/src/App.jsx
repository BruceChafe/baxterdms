import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  Grid,
  Paper,
  CssBaseline,
  Container,
} from '@mui/material';

import DarkModeToggle from './components/themetoggle/DarkModeToggle';
import { auth } from './firebase';
import SidebarMenu from './Sidebar';
import NewContact from './NewContact';
import ContactTable from './Contacts';
import SignInSide from './components/signin/SignIn';

const App = () => {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUserSignedIn(true);
      } else {
        setIsUserSignedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Use dark or light mode based on the state
    },
  });

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path='/signin' element={<SignInSide setIsUserSignedIn={setIsUserSignedIn} />} />
          {isUserSignedIn ? (
            <Route
              path='*'
              element={
                <Grid container>
                  <Grid item>
                    <SidebarMenu />
                  </Grid>
                  <Grid item lg>
                    <Container maxWidth="false">
                      <Paper
                        style={{
                          margin: '10px',
                          padding: '1px',
                        }}
                      >
                        <Routes>
                          <Route path='/contacts' element={<ContactTable />} />
                          <Route path='/newcontact' element={<NewContact />} />
                        </Routes>
                      </Paper>
                    </Container>
                  </Grid>
                </Grid>
              }
            />
          ) : (
            <Route path='*' element={<Navigate to='/signin' />} />
          )}
        </Routes>
        {/* Toggle dark/light mode button */}
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </ThemeProvider>
    </Router>
  );
};

export default App;
