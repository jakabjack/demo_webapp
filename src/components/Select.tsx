interface SelectProps {
  options: Record<string, string>;
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  placeholder?: string;
}

const Select = ({ options, onChange, value, className = '', placeholder }: SelectProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className={className}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {Object.entries(options).map(([key, val]) => (
        <option key={key} value={val}>
          {key}
        </option>
      ))}
    </select>
  );
};

export default Select;
