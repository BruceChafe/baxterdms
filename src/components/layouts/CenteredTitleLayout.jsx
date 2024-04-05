import React from 'react';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';

const CenteredTitleLayout = ({
  title,
  leftActions,
  rightActions,
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          {leftActions}
        </Box>

        <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center', m: 1 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {rightActions}
        </Box>
      </Box>
      <Divider />
    </Box>
  );
};

export default CenteredTitleLayout;
