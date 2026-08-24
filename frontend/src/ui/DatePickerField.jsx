import DatePicker from 'react-multi-date-picker';
import persion from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

function DatePickerField({ label, date, setDate, required = false }) {
  return (
    <div className="karava-form-field">
      <span className="karava-form-label">
        {label}
        {required ? <span className="text-karava-red"> *</span> : null}
      </span>
      <DatePicker
        containerClassName="w-full"
        inputClass="karava-form-input"
        calendarPosition="bottom-center"
        value={date}
        onChange={(nextDate) => setDate(nextDate)}
        format="YYYY/MM/DD"
        calendar={persion}
        locale={persian_fa}
      />
    </div>
  );
}

export default DatePickerField;
