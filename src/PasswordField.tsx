import type React from 'react';
import TextField from './TextField';
import type { FieldChangeEvent } from './types';

interface PasswordFieldProps {
  id?: string | undefined;
  value?: string | undefined;
  onChange?: ((event: FieldChangeEvent) => void) | undefined;
  helperText?: string | undefined;
  label?: string | undefined;
  name?: string | undefined;
  autoComplete?: string | undefined;
  placeholder?: string | undefined;
}

export default function PasswordField({
  id = 'password',
  value,
  onChange,
  helperText,
  name = 'password',
  placeholder = 'Enter your password',
  label = 'Password',
  autoComplete = 'current-password',
}: PasswordFieldProps): React.ReactElement {
  return (
    <TextField
      {...{
        id,
        value,
        onChange,
        placeholder,
        helperText,
        label,
        name,
        autoComplete,
        type: 'password',
      }}
    />
  );
}
