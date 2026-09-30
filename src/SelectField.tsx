// SPDX-License-Identifier: AGPL-3.0-or-later
import type React from 'react';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import type { FieldAriaProps, FieldChangeEvent } from './types';

export type SelectItemOption = string | { value: string; label?: string };

interface SelectFieldProps extends FieldAriaProps {
  id: string;
  value: string;
  onChange: (event: FieldChangeEvent) => void;
  items: SelectItemOption[];
  name: string;
  label: string;
  placeholder?: string;
}

const optionValueOf = (item: SelectItemOption): string => (typeof item === 'string' ? item : item.value);
const optionLabelOf = (item: SelectItemOption): string => (typeof item === 'string' ? item : (item.label ?? item.value));

export default function SelectField({
  id,
  value,
  onChange,
  items,
  name,
  label,
  placeholder = 'Select an option',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: SelectFieldProps): React.ReactElement {
  const handleValueChange = (selectedValue: string): void => {
    const event: FieldChangeEvent = {
      target: { value: selectedValue, name },
    };

    onChange(event);
  };

  return (
    <div className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger id={id} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy} className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {items.map((item) => {
              const optionValue = optionValueOf(item);
              return (
                <SelectItem key={optionValue} value={optionValue}>
                  {optionLabelOf(item)}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
