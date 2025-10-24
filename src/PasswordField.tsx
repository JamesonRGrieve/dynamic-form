import type { InputHTMLAttributes } from 'react';
import { TextField } from './TextField';

export interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  helperText?: string;
  label?: string;
  name?: string;
}

export function PasswordField({
  id = 'password',
  value,
  onChange,
  helperText,
  name = 'password',
  placeholder = 'Enter your password',
  label = 'Password',
  autoComplete = 'current-password',
  disabled = false,
  ...rest
}: PasswordFieldProps) {
  return (
    <TextField
      {...rest}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      helperText={helperText}
      label={label}
      name={name}
      autoComplete={autoComplete}
      type='password'
      disabled={disabled}
    />
  );
}
