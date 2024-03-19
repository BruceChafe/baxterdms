import React from 'react';
import { Typography, Tooltip, Stack } from '@mui/material';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';

const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return null;
};

const FormatPhoneNumber = ({ type, number }) => {
  if (!number) return null;

  const formattedNumber = formatPhoneNumber(number);

  let Icon;
  let tooltipTitle;
  switch (type) {
    case 'mobile':
      Icon = <SmartphoneIcon fontSize="small" sx={{ mr: 1 }} />;
      tooltipTitle = "Mobile Phone";
      break;
    case 'home':
      Icon = <HomeIcon fontSize="small" sx={{ mr: 1 }} />;
      tooltipTitle = "Home Phone";
      break;
    case 'work':
      Icon = <WorkIcon fontSize="small" sx={{ mr: 1 }} />;
      tooltipTitle = "Work Phone";
      break;
    default:
      Icon = null;
  }

  return (
    <Tooltip title={tooltipTitle}>
      <Stack direction="row" alignItems="center">
        {Icon}
        <Typography variant="body2">{formattedNumber}</Typography>
      </Stack>
    </Tooltip>
  );
};

export default FormatPhoneNumber;
