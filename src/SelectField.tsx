'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later
import { type ReactElement, useMemo } from 'react';
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
}: SelectFieldProps): ReactElement {
  const handleValueChange = (selectedValue: string): void => {
    const event: FieldChangeEvent = {
      target: { value: selectedValue, name },
    };

    onChange(event);
  };

  // Radix renders a closed Select's content off-screen to read the item labels, so every option
  // re-renders whenever the field does, and a form re-renders its fields on every keystroke. The
  // same element is reused while the items and label are unchanged, so React skips the list
  // (hundreds of options for a timezone picker).
  const content = useMemo(
    () => (
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
    ),
    [items, label],
  );

  return (
    <div className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger id={id} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy} className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {content}
      </Select>
    </div>
  );
}
