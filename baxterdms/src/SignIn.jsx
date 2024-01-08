// SignIn Component
// This component handles user authentication, allowing users to sign in using their email and password.

// Importing necessary components and icons
import React, { useState } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Paper, Box, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

// Copyright component for displaying copyright information
function Copyright() {
  return (
    <Typography align="center">
      {'Copyright © baxter dms '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// Functional component for handling user sign-in
function SignInSide({ setIsUserSignedIn }) {

  // State variables for user credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hook for navigation in React Router
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Use Firebase Auth API to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Update the authentication state in the parent component
      setIsUserSignedIn(true);

      // Redirect to the desired page
      navigate('/contacts');

    } catch (error) {
      // Log authentication error details
      console.error('Authentication error:', error.message);
      console.error('Full error details:', error);
    }
  };

  // JSX structure for rendering the sign-in form
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Branding */}
          <Typography variant="h6">baxter.</Typography>

          {/* Sign-in form */}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            {/* Sign-in button */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>

            {/* Forgot password link */}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" style={{ color: 'white' }}>
                  Forgot password?
                </Link>
              </Grid>
            </Grid>

            {/* Copyright information */}
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SignInSide;
