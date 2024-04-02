import React from 'react';
import Button from '@mui/material/Button';

const SaveEditButton = ({ isEditable, onToggleEdit }) => {
  return (
    <Button variant="contained" onClick={onToggleEdit} sx={{ mt: 2 }}>
      {isEditable ? "Save" : "Edit"}
    </Button>
  );
};

export default SaveEditButton;
