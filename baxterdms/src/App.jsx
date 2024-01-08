// Import necessary components and styles from Material-UI and react-router-dom
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

// Create a dark theme using Material-UI's createTheme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

// Main App component
function App() {
  // State to track user authentication status
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  // useEffect to check user authentication status on mount
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

  // JSX for rendering the App component
  return (
    <Router>
      {/* ThemeProvider for applying the dark theme */}
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {/* react-router-dom Routes for handling navigation */}
        <Routes>
          {/* Route for sign-in page */}
          <Route path='/signin' element={<SignIn setIsUserSignedIn={setIsUserSignedIn} />} />
          {/* Conditional route based on user authentication status */}
          {isUserSignedIn ? (
            <Route
              path='*'
              // Layout for authenticated users with SidebarMenu and main content
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
                        {/* Nested react-router-dom Routes for handling different views */}
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

// Export the App component as the default export
export default App;
