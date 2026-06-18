import { Box } from "@mui/material";

const ModalWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        margin: "1rem 0",
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
};

export default ModalWrapper;
