import React from 'react';
import { TextField, Box, IconButton } from '@mui/material';
import { Clear } from '@mui/icons-material';

const SearchComponent = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleReset = () => {
    setSearchQuery('');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        label="Search Inventory"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {searchQuery && (
        <IconButton onClick={handleReset}>
          <Clear />
        </IconButton>
      )}
    </Box>
  );
};

export default SearchComponent;
