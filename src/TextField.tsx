import { type InputHTMLAttributes, forwardRef } from 'react';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import type { FieldChangeEvent } from './types';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
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

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, value, onChange, helperText, label, placeholder, name, autoComplete, className, type = 'text', error, ...props },
  ref,
) {
  return (
    <div className='flex flex-col w-full gap-2 mb-4'>
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
});

export default TextField;
