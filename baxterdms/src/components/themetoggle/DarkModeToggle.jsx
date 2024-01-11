import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <Tooltip title={`Toggle ${darkMode ? 'Light' : 'Dark'} Mode`} placement="left">
          <IconButton
            sx={{ position: 'fixed', bottom: '16px', right: '16px' }}
            color="inherit"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
  );
};

export default DarkModeToggle;
