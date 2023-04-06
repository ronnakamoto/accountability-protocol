import React, { useState } from "react";
import { enGB } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";

registerLocale("en-GB", enGB);

interface DatetimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  dateFormat?: string;
  timeFormat?: string;
  timeIntervals?: number;
  locale?: string;
  className?: string;
}

const DatetimePicker: React.FC<DatetimePickerProps> = ({
  value,
  onChange,
  dateFormat = "MMMM d, yyyy h:mm aa",
  timeFormat = "HH:mm",
  timeIntervals = 15,
  locale = "en-GB",
  className = "",
}) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      if (onChange) {
        onChange(date);
      }
    }
  };

  return (
    <DatePicker
      dayClassName={() => "datetime-picker__day"}
      selected={selectedDate}
      onChange={handleDateChange}
      showTimeSelect
      timeFormat={timeFormat}
      timeIntervals={timeIntervals}
      dateFormat={dateFormat}
      locale={locale}
      className={`input input-sm input-bordered w-full max-w-xs ${className}`}
    />
  );
};

export default DatetimePicker;
