// ThemeSelection.js
import React from 'react';
import { Button, Paper, Typography, Divider } from '@mui/material';

import { useTheme } from '../../context/ThemeContext';

const ThemeSelection = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Paper style={{ margin: '20px', padding: '15px' }}>
      <Typography style={{ margin: '20px' }}>Appearance</Typography>
      <Divider style={{ margin: '20px' }} />
      <Button
        onClick={() => toggleTheme('retroWaveDreamTheme')}
        variant={theme === 'retroWaveDreamTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Retrowave Dream
      </Button>
      <Button
        onClick={() => toggleTheme('luminousMorningTheme')}
        variant={theme === 'luminousMorningTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Serene Sunrise
      </Button>
      <Button
        onClick={() => toggleTheme('whimsicalMeadowTheme')}
        variant={theme === 'whimsicalMeadowTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Whimsical Meadow
      </Button>
      <Button
        onClick={() => toggleTheme('cottonCandyDreamTheme')}
        variant={theme === 'cottonCandyDreamTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Cotton Candy Dream
      </Button>
      <Divider style={{ margin: '20px' }} />
      <Button
        onClick={() => toggleTheme('midnightMystiqueTheme')}
        variant={theme === 'midnightMystiqueTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Midnight Mystique
      </Button>
      <Button
        onClick={() => toggleTheme('shadowyForestTheme')}
        variant={theme === 'shadowyForestTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Shadowy Forest
      </Button>
      <Button
        onClick={() => toggleTheme('cosmicNebulaTheme')}
        variant={theme === 'cosmicNebulaTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Cosmic Nebula
      </Button>
      <Button
        onClick={() => toggleTheme('obsidianDreamTheme')}
        variant={theme === 'obsidianDreamTheme' ? 'contained' : 'outlined'}
        color="primary"
        style={{ marginRight: '10px' }}
      >
        Obsidian Dream
      </Button>
    </Paper>
  );
  
};

export default ThemeSelection;
