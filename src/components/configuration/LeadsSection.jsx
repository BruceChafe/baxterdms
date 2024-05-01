// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { Button, Paper, Typography, CircularProgress } from "@mui/material";
// import { Box } from "@mui/system";
// import TransferList from "../transferList/TransferList";
// import { useSnackbar } from "../../context/SnackbarContext"; // Make sure the path is correct for your project structure

// const LeadsSection = ({
//   label,
//   unactiveData,
//   activeData,
//   setUnactiveData,
//   setActiveData,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const { showSnackbar } = useSnackbar();

//   const handleSave = async () => {
//     setLoading(true);
//     const field = label.replace(" Management", "").replaceAll(" ", "");
//     const docRef = doc(db, 'leadConfig', 'configData');
//     const dataToSend = {
//       [`${field}Unactive`]: unactiveData,
//       [`${field}Active`]: activeData,
//     };

//     try {
//       await updateDoc(docRef, dataToSend);
//       showSnackbar("Update successful for " + field, "success");
//       console.log("Update successful for:", field);
//     } catch (error) {
//       console.error("Error updating configuration for:", field, error);
//       showSnackbar("Error updating configuration for " + field + ": " + error.message, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ mb: 2 }}>
//       <Paper sx={{ p: 3, mb: 2, border: "solid", borderColor: "divider" }}>
//         <Typography variant="h5" mb={2}>{label}</Typography>
//         <TransferList
//           leftItems={unactiveData || []}
//           rightItems={activeData || []}
//           setLeftItems={setUnactiveData}
//           setRightItems={setActiveData}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleSave}
//           disabled={loading}
//           sx={{ mt: 2 }}
//         >
//           {loading ? <CircularProgress size={24} /> : "Save Changes"}
//         </Button>
//       </Paper>
//     </Box>
//   );
// };

// export default LeadsSection;
