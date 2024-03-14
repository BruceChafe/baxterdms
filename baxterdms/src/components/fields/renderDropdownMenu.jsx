import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const DropdownMenu = ({ label, value, options, onChange, isDisabled = false }) => (
  <TextField
    select
    label={label}
    value={value}
    onChange={onChange}
    fullWidth
    disabled={isDisabled}
  >
    {options.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
  </TextField>
);

export default DropdownMenu;
