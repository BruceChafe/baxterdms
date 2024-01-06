import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';

import { auth } from './firebase'; // Import the auth object from firebase.js
import SidebarMenu from './Sidebar';
import NewContact from './NewContact';
import ContactTable from './Contacts';
import SignIn from './SignIn';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    // Check user authentication status on mount
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUserSignedIn(true);
      } else {
        setIsUserSignedIn(false);
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Routes>
          <Route path='/signin' element={<SignIn setIsUserSignedIn={setIsUserSignedIn} />} />
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
            // If the user is not signed in, redirect to the sign-in page
            <Route path='*' element={<Navigate to='/signin' />} />
          )}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
