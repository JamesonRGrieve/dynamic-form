import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { Input } from './primitives/Input';
import { Label } from './primitives/Label';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name: string;
  label?: string;
  helperText?: string;
  error?: string | boolean;
  onChange?: (value: string) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, value, onChange, helperText, label, name, className = '', type = 'text', error, ...rest }, ref) => {
    return (
      <div className='flex w-full flex-col gap-2'>
        {label && (
          <Label htmlFor={id} className='text-sm font-semibold text-gray-800'>
            {label}
          </Label>
        )}
        <Input
          {...rest}
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={(event) => onChange?.(event.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          className={`${Boolean(error) ? 'border-red-500 focus:ring-red-500' : ''} ${className}`.trim()}
        />
        {typeof error === 'string' && error.length > 0 ? (
          <p id={`${id}-error`} className='text-sm text-red-600' role='alert'>
            {error}
          </p>
        ) : (
          helperText && (
            <p id={`${id}-helper`} className='text-sm text-gray-500'>
              {helperText}
            </p>
          )
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
