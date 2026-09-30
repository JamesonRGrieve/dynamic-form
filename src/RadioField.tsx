// SPDX-License-Identifier: AGPL-3.0-or-later
import type React from 'react';
import { toHtmlId } from './lib/htmlId';
import type { FieldAriaProps, FieldChangeEvent } from './types';

export type RadioItem = string | { value: string; label?: string };

/** A radio group must be named: by a visible element's id, or failing that by its label. */
type RadioGroupName =
  { label: string; 'aria-labelledby'?: string | undefined } | { label?: string | undefined; 'aria-labelledby': string };

type RadioFieldProps = FieldAriaProps &
  RadioGroupName & {
    id: string;
    value: string;
    onChange: (event: FieldChangeEvent) => void;
    items: RadioItem[];
    name: string;
  };

const itemValueOf = (item: RadioItem): string => (typeof item === 'string' ? item : item.value);
const itemLabelOf = (item: RadioItem): string => (typeof item === 'string' ? item : (item.label ?? item.value));

export default function RadioField({
  id,
  value,
  onChange,
  items,
  name,
  label,
  'aria-labelledby': ariaLabelledBy,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: RadioFieldProps): React.ReactElement {
  return (
    <div
      id={id}
      role='radiogroup'
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabelledBy === undefined ? label : undefined}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
    >
      {items.map((item) => {
        const itemValue = itemValueOf(item);
        const itemLabel = itemLabelOf(item);
        const itemId = `${id}-${toHtmlId(itemValue)}`;

        return (
          <label key={itemValue} htmlFor={itemId} className='flex items-center mb-2 cursor-pointer'>
            {/* Visually hidden but focusable, so the group works from the keyboard. */}
            <input
              type='radio'
              id={itemId}
              name={name}
              value={itemValue}
              checked={value === itemValue}
              onChange={onChange}
              className='peer sr-only'
            />
            <div
              className={`w-5 h-5 border rounded-full mr-2 flex items-center justify-center peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2
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
