import type React from 'react';
import type { FieldChangeEvent } from './types';

export type RadioItem = string | { value: string; label?: string };

interface RadioFieldProps {
  id: string;
  value: string;
  onChange: (event: FieldChangeEvent) => void;
  items: RadioItem[];
  name: string;
}

const itemValueOf = (item: RadioItem): string => (typeof item === 'string' ? item : item.value);
const itemLabelOf = (item: RadioItem): string => (typeof item === 'string' ? item : (item.label ?? item.value));

export default function RadioField({ id, value, onChange, items, name }: RadioFieldProps): React.ReactElement {
  return (
    <div id={id} role='radiogroup' aria-labelledby={id}>
      {items.map((item) => {
        const itemValue = itemValueOf(item);
        const itemLabel = itemLabelOf(item);
        const itemId = itemValue.replace(/[\W_]+/g, '');

        return (
          <label key={itemValue} htmlFor={itemId} className='flex items-center mb-2 cursor-pointer'>
            <input
              type='radio'
              id={itemId}
              name={name}
              value={itemValue}
              checked={value === itemValue}
              onChange={onChange}
              className='hidden'
            />
            <div
              className={`w-5 h-5 border rounded-full mr-2 flex items-center justify-center
              ${value === itemValue ? 'border-blue-500' : 'border-gray-300'}`}
            >
              {value === itemValue && <div className='w-3 h-3 bg-blue-500 rounded-full' />}
            </div>
            <span className='text-gray-700'>{itemLabel}</span>
          </label>
        );
      })}
    </div>
  );
}
