// SPDX-License-Identifier: AGPL-3.0-or-later
import type React from 'react';
import CheckField from './CheckField';
import PasswordField from './PasswordField';
import RadioField from './RadioField';
import SelectField from './SelectField';
import TextField from './TextField';
import { Label } from './components/ui/label';
import { cn } from './lib/utils';
import type { FieldChangeEvent, FieldChangeHandler } from './types';

export type { FieldChangeEvent, FieldChangeHandler } from './types';

export type Message = {
  level: string;
  value: string;
};
export type FieldDefinition = {
  label: string;
  description?: string;
  autoComplete?: string;
  placeholder?: string;
  validate?: (value: string) => boolean;
  type?: 'text' | 'password' | 'select' | 'time' | 'date' | 'datetime' | 'checkbox' | 'radio';
  items?: {
    value: string;
    label: string;
  }[];
};

export type FieldProps = FieldDefinition & {
  nameID: string;
  value?: string;
  onChange?: FieldChangeHandler;
  messages?: Message[];
};

const FieldInput: React.FC<FieldProps> = ({
  nameID,
  label,
  value,
  onChange,
  autoComplete,
  placeholder = '',
  type = 'text',
  items,
}) => {
  const injectedOnChange = (event: FieldChangeEvent): void => {
    onChange?.(event, nameID);
  };

  const commonProps = {
    id: nameID,
    name: nameID,
    onChange: injectedOnChange,
    label,
  };

  switch (type) {
    case 'text':
      return <TextField {...commonProps} value={value} autoComplete={autoComplete} placeholder={placeholder} />;
    case 'password':
      return <PasswordField {...commonProps} value={value} autoComplete={autoComplete} />;
    case 'select':
      return <SelectField {...commonProps} value={value ?? ''} items={items ?? []} />;
    case 'checkbox':
      return <CheckField {...commonProps} value={['on', 'true'].includes(value?.toLowerCase() ?? '')} />;
    case 'radio':
      return <RadioField {...commonProps} value={value ?? ''} items={items ?? []} />;
    case 'time':
    case 'date':
    case 'datetime':
      return <TextField {...commonProps} value={value} autoComplete={autoComplete} type={type} />;
    default:
      return <TextField {...commonProps} value={value} autoComplete={autoComplete} />;
  }
};

const Field: React.FC<FieldProps> = ({ nameID, label, description, type = 'text', messages = [], ...rest }) => {
  return (
    <div className='w-full my-4'>
      {['checkbox', 'radio'].includes(type) && (
        <Label id={`${nameID}-label`} htmlFor={nameID}>
          {label}
        </Label>
      )}
      {description !== undefined && description !== '' && <p className='mb-2'>{description}</p>}
      <FieldInput nameID={nameID} label={label} type={type} {...rest} />
      <div className={cn('transition-all', messages.length > 0 ? 'block' : 'hidden')}>
        {messages.map((message) => (
          <div
            key={`${message.level}-${message.value}`}
            className={`mt-2 p-3 rounded ${
              message.level === 'error'
                ? 'bg-red-100 text-red-700'
                : message.level === 'warning'
                  ? 'bg-yellow-100 text-yellow-700'
                  : message.level === 'info'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
            }`}
          >
            {message.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Field;
