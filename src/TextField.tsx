// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ComponentProps, JSX } from 'react';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import type { FieldChangeEvent } from './types';

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  id: string;
  value?: string | undefined;
  onChange?: ((event: FieldChangeEvent) => void) | undefined;
  helperText?: string | undefined;
  label?: string | undefined;
  name: string;
  autoComplete?: string | undefined;
  placeholder?: string | undefined;
  className?: string | undefined;
  type?: string | undefined;
  error?: string | boolean | undefined;
}

function TextField({
  id,
  value,
  onChange,
  helperText,
  label,
  placeholder,
  name,
  autoComplete,
  className,
  type = 'text',
  error,
  ref,
  ...props
}: TextFieldProps): JSX.Element {
  return (
    <div data-slot='text-field' className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        {...{ id, value, onChange, name, autoComplete, placeholder, type, ref }}
        className={`border ${error !== undefined && error !== false && error !== '' ? 'border-red-500' : 'border-gray-300'} ${className ?? ''}`}
      />
      {typeof error === 'string' && error !== '' && <p className='text-sm text-red-500'>{error}</p>}
      {(error === undefined || error === false || error === '') && helperText !== undefined && helperText !== '' && (
        <p className='text-sm text-gray-500'>{helperText}</p>
      )}
    </div>
  );
}

export default TextField;
