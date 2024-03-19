import React from 'react';
import { Typography, Stack } from '@mui/material';

const FormatAddress = ({ streetAddress, city, province, postalCode }) => {
  return (
    <Stack spacing={0.5}>
      {streetAddress && (
        <Typography variant="body2" component="div">
          {streetAddress}
        </Typography>
      )}
      <Typography variant="body2" component="div">
        {[city, province].filter(Boolean).join(', ')} {postalCode}
      </Typography>
    </Stack>
  );
};

export default FormatAddress;
