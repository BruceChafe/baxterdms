import React, { useState, memo } from "react";
import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  Tooltip,
  IconButton,
  styled,
} from "@mui/material";
import {
  KeyboardDoubleArrowRight,
  KeyboardDoubleArrowLeft,
  ArrowForward,
  ArrowBack,
  Add,
} from "@mui/icons-material";

const ScrollableList = styled(List)({
  height: 220,
  overflowY: "auto",
});

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

const TransferList = ({
  leftItems,
  rightItems,
  setLeftItems,
  setRightItems,
}) => {
  const [checked, setChecked] = useState([]);
  const [newItem, setNewItem] = useState("");

  const leftChecked = not(checked, rightItems);
  const rightChecked = not(checked, leftItems);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRightItems(rightItems.concat(leftItems));
    setLeftItems([]);
  };

  const handleCheckedRight = () => {
    setRightItems(rightItems.concat(leftChecked));
    setLeftItems(not(leftItems, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeftItems(leftItems.concat(rightChecked));
    setRightItems(not(rightItems, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeftItems(leftItems.concat(rightItems));
    setRightItems([]);
  };

  const handleAddNewItem = () => {
    if (newItem.trim() !== "") {
      setLeftItems((prevLeftItems) => [...prevLeftItems, newItem]);
      setNewItem("");
    }
  };

  const CustomList = ({ items }) => (
    <ScrollableList dense>
      {items.map((value) => {
        const labelId = `transfer-list-item-${value}-label`;
        return (
          <ListItemButton
            key={value}
            role="listitem"
            onClick={handleToggle(value)}
          >
            <ListItemIcon>
              <Checkbox
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": labelId,
                }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value} />
          </ListItemButton>
        );
      })}
    </ScrollableList>
  );

  return (
    <Box>
      <TextField
        label="New Item"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddNewItem}
        disabled={!newItem}
        sx={{ ml: 2 }}
      >
        Add
      </Button>
      <Grid container spacing={4} alignItems="center">
        <Grid item>
          <Paper
            variant="outlined"
            sx={{ height: "100%", minWidth: "200px", p: 2 }}
          >
            <CustomList items={leftItems} />
          </Paper>
        </Grid>
        <Grid item>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Tooltip title="Move All Right">
              <IconButton
                onClick={handleAllRight}
                disabled={leftItems.length === 0}
                aria-label="move all right"
              >
                <KeyboardDoubleArrowRight />
              </IconButton>
            </Tooltip>
            <Tooltip title="Move Selected Right">
              <IconButton
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <ArrowForward />
              </IconButton>
            </Tooltip>
            <Tooltip title="Move Selected Left">
              <IconButton
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Tooltip title="Move All Left">
              <IconButton
                onClick={handleAllLeft}
                disabled={rightItems.length === 0}
                aria-label="move all left"
              >
                <KeyboardDoubleArrowLeft />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item>
          <Paper
            variant="outlined"
            sx={{ height: "100%", minWidth: "200px", p: 2 }}
          >
            <CustomList items={rightItems} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransferList;
