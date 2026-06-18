import { MenuItem, TextField } from "@mui/material";
import PasswordInput from "./PasswordInput";
import SelectDate from "./SelectDate";
import dayjs from "dayjs";

const fieldRenderers = {
  text: ({ field, value, onChange, error, helperText, readOnly }) => (
    <TextField
      label={field.label}
      value={value || ""}
      onChange={(e) => onChange(field.key, e.target.value)}
      error={!!error}
      helperText={helperText}
      fullWidth
      InputLabelProps={{ shrink: true }}
      InputProps={{ readOnly }}
      sx={{ marginTop: "15px" }}
    />
  ),
  select: ({
    field,
    value,
    onChange,
    onFetch,
    error,
    helperText,
    readOnly,
  }) => {
    const handleSelectChange = (e) => {
      onChange(field.key, e.target.value);

      if (onFetch) {
        onFetch(field.key, e.target.value);
      }
    };

    return (
      <TextField
        select
        label={field.label}
        value={value || ""}
        onChange={handleSelectChange}
        error={!!error}
        helperText={helperText}
        fullWidth
        InputLabelProps={{ shrink: true }}
        InputProps={{ readOnly }}
        sx={{
          marginTop: "15px",
        }}
      >
        {field.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  },
  password: ({ field, value, onChange, readOnly, error, helperText }) => (
    <PasswordInput
      field={field}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      error={error}
      helperText={helperText}
    />
  ),
  date: ({ field, value, readOnly, error, helperText, onChange }) => {
    const parsedValue = value ? dayjs(value) : null;
    return (
      <SelectDate
        field={field}
        value={parsedValue}
        error={error}
        helperText={helperText}
        readOnly={readOnly}
        onChange={onChange}
      />
    );
  },
};

export default fieldRenderers;
