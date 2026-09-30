// SPDX-License-Identifier: AGPL-3.0-or-later
import type { ComponentProps, JSX } from 'react';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { describedBy } from './lib/htmlId';
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
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextFieldProps): JSX.Element {
  const hasError = error !== undefined && error !== false && error !== '';
  const errorText = typeof error === 'string' && error !== '' ? error : undefined;
  const hint = !hasError && helperText !== undefined && helperText !== '' ? helperText : undefined;
  const messageId = `${id}-message`;
  const message = errorText ?? hint;
  return (
    <div data-slot='text-field' className='flex flex-col w-full gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        {...{ id, value, onChange, name, autoComplete, placeholder, type, ref }}
        aria-invalid={ariaInvalid ?? hasError}
        aria-describedby={describedBy(ariaDescribedBy, message === undefined ? undefined : messageId)}
        className={`border ${hasError ? 'border-red-500' : 'border-gray-300'} ${className ?? ''}`}
      />
      {message !== undefined && (
        <p id={messageId} className={`text-sm ${errorText === undefined ? 'text-gray-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
}

export default TextField;
