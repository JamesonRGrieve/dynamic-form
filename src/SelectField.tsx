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

export type SelectItemOption = string | { value: string; label?: string };

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
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
}: SelectFieldProps): React.ReactElement {
  // TODO: Update the onChange in the interface (this requires refactoring the components that use it)
  const handleValueChange = (selectedValue: string): void => {
    const event = {
      target: { value: selectedValue, name },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(event);
  };

  return (
    <div className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Select onValueChange={handleValueChange} value={value}>
        <SelectTrigger className='w-full'>
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
