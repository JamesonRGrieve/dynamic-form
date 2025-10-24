import type { ChangeEvent } from 'react';
import { Label } from './primitives/Label';

export interface SelectItem {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  items: SelectItem[];
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  id,
  value,
  onChange,
  items,
  name,
  label,
  placeholder = 'Select an option',
  disabled = false,
}: SelectFieldProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className='flex w-full flex-col gap-2'>
      <Label htmlFor={id} className='text-sm font-semibold text-gray-800'>
        {label}
      </Label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100'
      >
        <option value='' disabled hidden>
          {placeholder}
        </option>
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
