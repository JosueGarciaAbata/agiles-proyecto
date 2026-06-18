import { Grid2, Button } from "@mui/material";
import ReportType from "./ReportType";

const ReportItem = ({ open, icon: Icon, label }) => {
  return (
    <Grid2 item xs={12} sm={4}>
      <ReportType>
        <Icon sx={{ fontSize: 90 }} />
        <Button
          sx={{ textTransform: "capitalize" }}
          arial-label={label}
          onClick={() => open(true)}
        >
          {label}
        </Button>
      </ReportType>
    </Grid2>
  );
};

export default ReportItem;
