import { Typography, Modal, styled, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalContent = styled(Box)`
  position: absolute;
  width: 100%;
  background-color: #000;
  border: 2px solid #000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  p: {
    margin: 0;
    padding: 10px;
  }
`;

const PasswordResetConfirmation = () => {
  return (
    <Modal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
    >
      <ModalContent sx={{ width: 400 }}>
        <IconButton
          aria-label="close"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 9999,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography>reset</Typography>
      </ModalContent>
    </Modal>
  );
};

export default PasswordResetConfirmation;
