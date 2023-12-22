import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CssBaseline from '@mui/material/CssBaseline';

import SidebarMenu from './Sidebar';
import NewContact from './NewContact';
import ContactTable from './Contacts';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Grid container >
          <Grid 
         
          item>
            <SidebarMenu />
          </Grid>
          <Grid item lg>
            <Container maxWidth="false" >
              <Paper
              style={{
                margin: "10px",
                padding: "1px"
            }}>
                <Routes>
                  <Route path='/contacts' element={<ContactTable />} />
                  <Route path='/newcontact' element={<NewContact />} />
                </Routes>
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Router>
  );
}

export default App;