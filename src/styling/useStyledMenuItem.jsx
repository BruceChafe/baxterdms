import { styled } from '@mui/system';
import { MenuItem } from "react-pro-sidebar";

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: '#C0C0C0 !important',
  backgroundColor: 'black !important',
  '&:hover': {
    backgroundColor: 'red !important',
    color: '#ffffff !important',
  },
}));

export default StyledMenuItem;
