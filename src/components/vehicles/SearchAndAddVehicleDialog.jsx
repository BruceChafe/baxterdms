import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchComponent from "../../../hooks/search/SearchComponent";

const SearchAndAddVehicleDialog = ({
  open,
  onClose,
  leadId,
  onVehicleAdded,
}) => {
  const searchFields = [
    { name: "make", label: "Make" },
    { name: "model", label: "Model" },
    { name: "vin", label: "VIN" },
  ];
  const resultFields = [
    "make",
    "model",
    "year",
    "vin",
    "dealer_name",
    "sale_price",
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Search Vehicles</DialogTitle>
      <DialogContent>
        <SearchComponent
          searchFields={searchFields}
          collectionPath="preOwnedVehicleInventory"
          resultFields={resultFields}
          leadId={leadId}
          onVehicleAdded={onVehicleAdded}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchAndAddVehicleDialog;
