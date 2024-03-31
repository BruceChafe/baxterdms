import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';

const TitleLayout = ({
  title,
  onSave,
  saveDisabled,
  actionButtons = [],
}) => {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box sx={{ m: 1 }}>
          {title}
        </Box>
        <Box>
          {onSave && (
            <Button onClick={onSave} variant="outlined" disabled={saveDisabled}>
              Save
            </Button>
          )}
          {actionButtons.map((button, index) => (
            <Button key={index} onClick={button.onClick} variant={button.variant || 'outlined'}>
              {button.label}
            </Button>
          ))}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default TitleLayout;
