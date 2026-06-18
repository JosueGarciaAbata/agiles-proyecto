import { Box } from "@mui/material";

const GeneralWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Box sx={{ width: "100%" }}> {children}</Box>
    </Box>
  );
};

export default GeneralWrapper;
