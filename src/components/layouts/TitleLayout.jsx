import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';

const TitleLayout = ({
  title,
  onSave,
  saveDisabled,
  actionButtons = [],
  isEditable,
  onToggleEdit,
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
          {onToggleEdit && (
            <Button onClick={onToggleEdit} variant="outlined" sx={{ mt: 2 }}>
              {isEditable ? "Save" : "Edit"} {/* Toggling label based on isEditable */}
            </Button>
          )}
          {/* Rest of the action buttons */}
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