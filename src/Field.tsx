import type { ReactNode } from 'react';
import { CheckField } from './CheckField';
import type { SelectItem } from './SelectField';
import { SelectField } from './SelectField';
import type { TextFieldProps } from './TextField';
import { TextField } from './TextField';
import { PasswordField } from './PasswordField';
import { RadioField, type RadioOption } from './RadioField';

export type MessageLevel = 'error' | 'warning' | 'info' | 'success';

export interface Message {
  level: MessageLevel;
  value: string;
}

export type FieldType = 'text' | 'password' | 'select' | 'checkbox' | 'radio';

export interface FieldProps {
  nameID: string;
  label: string;
  description?: ReactNode;
  autoComplete?: TextFieldProps['autoComplete'];
  placeholder?: TextFieldProps['placeholder'];
  type?: FieldType;
  items?: (SelectItem | RadioOption | string | { value: string; label: string })[];
  value?: string | boolean | string[];
  onChange?: (value: string | boolean | string[]) => void;
  messages?: Message[];
  disabled?: boolean;
  helperText?: string;
}

const messageColor: Record<MessageLevel, string> = {
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
};

export function Field({
  nameID,
  label,
  description,
  type = 'text',
  items = [],
  value,
  onChange,
  messages = [],
  disabled = false,
  helperText,
  autoComplete,
  placeholder,
}: FieldProps) {
  const hasMessages = messages.length > 0;

  const renderInput = () => {
    switch (type) {
      case 'password':
        return (
          <PasswordField
            id={nameID}
            name={nameID}
            label={label}
            autoComplete={autoComplete}
            onChange={(val) => onChange?.(val)}
            value={typeof value === 'string' ? value : ''}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      case 'select':
        return (
          <SelectField
            id={nameID}
            name={nameID}
            label={label}
            value={typeof value === 'string' ? value : ''}
            onChange={(val) => onChange?.(val)}
            items={(items as SelectItem[]) ?? []}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
      case 'checkbox':
        return (
          <CheckField
            id={nameID}
            name={nameID}
            value={(value as boolean | string[]) ?? false}
            onChange={(val) => onChange?.(val)}
            helperText={helperText}
            label={label}
            items={(items as (string | { value: string; label: string })[]) ?? []}
            disabled={disabled}
          />
        );
      case 'radio':
        return (
          <RadioField
            id={nameID}
            name={nameID}
            value={typeof value === 'string' ? value : ''}
            items={(items as RadioOption[]) ?? []}
            onChange={(val) => onChange?.(val)}
            label={label}
            disabled={disabled}
          />
        );
      case 'text':
      default:
        return (
          <TextField
            id={nameID}
            name={nameID}
            label={label}
            autoComplete={autoComplete}
            onChange={(val) => onChange?.(val)}
            value={typeof value === 'string' ? value : ''}
            helperText={helperText}
            error={messages.find((message) => message.level === 'error')?.value}
            placeholder={placeholder}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className='w-full space-y-2'>
      {description && <p className='text-sm text-gray-600'>{description}</p>}
      {renderInput()}
      {hasMessages && (
        <div className='space-y-2' role='alert' aria-live='polite'>
          {messages.map((message, index) => (
            <p key={index} className={`rounded-md px-3 py-2 text-sm ${messageColor[message.level]}`}>
              {message.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
