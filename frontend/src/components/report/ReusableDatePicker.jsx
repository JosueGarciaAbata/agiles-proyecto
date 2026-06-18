import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const ReusableDatePicker = ({ label, value, onChange, error, helperText }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value ? dayjs.utc(value) : null}
        onChange={onChange}
        sx={{ width: "50%" }}
        slotProps={{
          textField: {
            variant: "outlined",
            error: !!error,
            helperText: helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default ReusableDatePicker;
