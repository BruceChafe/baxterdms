import React, { useState, useEffect } from "react";
import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

const LeadsConfig = () => {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/configLeads/1")
      .then((response) => response.json())
      .then((data) => {
        setLeft(data.leadSourceUnactive || []);
        setRight(data.leadSourceActive || []);
      })
      .catch((error) => {
        console.error("Error fetching configuration:", error);
      });
  }, []);

  const leftChecked = not(checked, right);
  const rightChecked = not(checked, left);

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
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const handleAddNewItem = () => {
    setLeft([...left, newItem]);
    setNewItem("");
  };

  const handleSave = () => {
    fetch("http://localhost:8000/configLeads/1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leadSourceUnactive: left,
        leadSourceActive: right,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Update successful:", data);
      })
      .catch((error) => {
        console.error("Error updating configuration:", error);
      });
  };

  const customList = (items) => (
    <List dense component="div" role="list">
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
    </List>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        New Lead Configuration
      </Typography>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Source
      </Typography>
      <TextField
          label="New Item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          sx={{ my: 0.5 }}
          variant="outlined"
          size="small"
          onClick={handleAddNewItem}
          disabled={!newItem}
          aria-label="add new item"
        >
          Add
        </Button>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Paper variant="outlined" sx={{ height: "100%", minWidth: '200px'}}>
            {customList(left)}
          </Paper>
        </Grid>
        <Grid item sx={{ pt: 3 }}>
          <Grid container direction="column">
            <Button
              variant="outlined"
              size="small"
              onClick={handleAllRight}
              disabled={left.length === 0}
              aria-label="move all right"
            >
              ≫
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleAllLeft}
              disabled={right.length === 0}
              aria-label="move all left"
            >
              ≪
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleSave}
              aria-label="save"
            >
              Save
            </Button>
          </Grid>
        </Grid>
        <Grid item>
        <Paper variant="outlined" sx={{ height: "100%", minWidth: '200px'}}>
          <Grid item>{customList(right)}</Grid>
        </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadsConfig;