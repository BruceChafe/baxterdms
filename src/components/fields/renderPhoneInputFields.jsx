import React from 'react';
import InputMask from 'react-input-mask';
import { TextField } from '@mui/material';

const PhoneInputField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
}) => (
  <InputMask
    mask="(999) 999-9999"
    value={value}
    onChange={onChange}
    maskChar=" "
  >
    {(inputProps) => (
      <TextField
        {...inputProps}
        label={label}
        name={name}
        fullWidth
        variant="outlined"
        error={error}
        helperText={helperText}
      />
    )}
  </InputMask>
);

export { PhoneInputField };
