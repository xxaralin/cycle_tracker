// src/DateInput.jsx
import { useMemo } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export default function DateInput({ value, onChange }) {
  // value: "YYYY-MM-DD" (örn: "2025-12-11") veya "" olabilir

  const selectedDate = useMemo(() => {
    if (!value) return null;
    const [y, m, d] = value.split("-");
    return new Date(Number(y), Number(m) - 1, Number(d));
  }, [value]);

  const handleChange = (date) => {
    if (!date) {
      onChange("");
      return;
    }
    const iso = format(date, "yyyy-MM-dd");
    onChange(iso);
  };

  return (
    <div className="date-picker-wrapper">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        locale={tr}
        dateFormat="dd/MM/yyyy"
        placeholderText="gg/aa/yyyy"
        className="input date-input-field"
        calendarClassName="date-picker-calendar"
        popperPlacement="bottom-start"
      />
    </div>
  );
}