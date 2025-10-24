import type { ChangeEvent } from 'react';

type MultiOption = string | { value: string; label: string };

function toOptionValue(option: MultiOption) {
  return typeof option === 'string' ? option : option.value;
}

function toOptionLabel(option: MultiOption) {
  return typeof option === 'string' ? option : option.label;
}

export interface CheckFieldProps {
  id: string;
  name: string;
  value: boolean | string[];
  onChange: (value: boolean | string[]) => void;
  helperText?: string;
  label?: string;
  items?: MultiOption[];
  disabled?: boolean;
}

export function CheckField({ id, name, value, onChange, helperText, label, items, disabled = false }: CheckFieldProps) {
  const handleSingleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  const handleMultiChange = (option: MultiOption, checked: boolean) => {
    const optionValue = toOptionValue(option);
    const current = Array.isArray(value) ? [...value] : [];
    const next = checked ? Array.from(new Set([...current, optionValue])) : current.filter((entry) => entry !== optionValue);
    onChange(next);
  };

  if (Array.isArray(items) && items.length > 0) {
    return (
      <fieldset className='space-y-2'>
        <legend className='text-sm font-semibold text-gray-800'>{label}</legend>
        {items.map((item) => {
          const optionValue = toOptionValue(item);
          const elementId = `${id}-${optionValue.replace(/[\W_]+/g, '').toLowerCase()}`;
          const checked = Array.isArray(value) ? value.includes(optionValue) : false;
          return (
            <label key={optionValue} htmlFor={elementId} className='flex items-center gap-2 text-sm text-gray-700'>
              <input
                type='checkbox'
                id={elementId}
                name={`${name}[]`}
                checked={checked}
                disabled={disabled}
                onChange={(event) => handleMultiChange(item, event.target.checked)}
                className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span>{toOptionLabel(item)}</span>
            </label>
          );
        })}
        {helperText && <p className='text-sm text-gray-500'>{helperText}</p>}
      </fieldset>
    );
  }

  return (
    <label htmlFor={id} className='flex items-center gap-2 text-sm text-gray-700'>
      <input
        type='checkbox'
        id={id}
        name={name}
        checked={Boolean(value)}
        disabled={disabled}
        onChange={handleSingleChange}
        className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
      />
      <span>{helperText ?? label}</span>
    </label>
  );
}
