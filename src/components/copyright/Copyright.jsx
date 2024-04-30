import { Typography } from "@mui/material";

const Copyright = () => {
    return ( 
        <Typography align="center">
        {'Copyright © baxter '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
     );
}
 
export default Copyright;
