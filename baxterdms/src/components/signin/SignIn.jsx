import React, { useState } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import BackgroundImage from './BackgroundImage';
import ForgotPassword from './ForgotPassword';
import Copyright from '../copyright/Copyright';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)   
      console.log(user)
      navigate('/home');
    } catch (error) {
      console.error('Authentication error:', error.message);
      console.error('Full error details:', error);
    }
  };

  const handleForgotPasswordClick = (event) => {
    event.preventDefault();
    setShowForgotPassword(!showForgotPassword);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <BackgroundImage />
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
          <Typography variant="h6">baxter.</Typography>

          {showForgotPassword ? (
            <ForgotPassword />
          ) : (
            <Box component="form" noValidate onSubmit={handleSignIn} style={{ width: '80%' }}>
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

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Sign In
              </Button>

              {/* Show ForgotPassword link when showForgotPassword is false */}
              {!showForgotPassword && (
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" style={{ color: 'white' }} onClick={handleForgotPasswordClick}>
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
          <Copyright sx={{ mt: 5 }} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignIn;
