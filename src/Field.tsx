// SPDX-License-Identifier: AGPL-3.0-or-later
import type React from 'react';
import CheckField from './CheckField';
import PasswordField from './PasswordField';
import RadioField from './RadioField';
import SelectField from './SelectField';
import TextField from './TextField';
import { Label } from './components/ui/label';
import type { FieldAriaProps, FieldChangeEvent, FieldChangeHandler } from './types';

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

const labelIdOf = (nameID: string): string => `${nameID}-label`;

const FieldInput: React.FC<FieldProps & FieldAriaProps> = ({
  nameID,
  label,
  value,
  onChange,
  autoComplete,
  placeholder = '',
  type = 'text',
  items,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}) => {
  const injectedOnChange = (event: FieldChangeEvent): void => {
    onChange?.(event, nameID);
  };

  const commonProps = {
    id: nameID,
    name: nameID,
    onChange: injectedOnChange,
    label,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
  };

  switch (type) {
    case 'text':
      return <TextField {...commonProps} value={value} autoComplete={autoComplete} placeholder={placeholder} />;
    case 'password':
      return <PasswordField {...commonProps} value={value} autoComplete={autoComplete} />;
    case 'select':
      return <SelectField {...commonProps} value={value ?? ''} items={items ?? []} />;
    case 'checkbox':
      // A checkbox's DOM value is always "on"; report whether it is ticked instead.
      return (
        <CheckField
          {...commonProps}
          value={['on', 'true'].includes(value?.toLowerCase() ?? '')}
          onChange={(event) => {
            injectedOnChange({ target: { name: nameID, value: String(event.target.checked) } });
          }}
        />
      );
    case 'radio':
      return <RadioField {...commonProps} aria-labelledby={labelIdOf(nameID)} value={value ?? ''} items={items ?? []} />;
    case 'time':
    case 'date':
    case 'datetime':
      return <TextField {...commonProps} value={value} autoComplete={autoComplete} type={type} />;
    default:
      return <TextField {...commonProps} value={value} autoComplete={autoComplete} />;
  }
};

const Field: React.FC<FieldProps> = ({ nameID, label, description, type = 'text', messages = [], ...rest }) => {
  const messagesId = `${nameID}-messages`;
  return (
    <div className='w-full my-4'>
      {['checkbox', 'radio'].includes(type) && (
        // A radio group is a div, which a label cannot target; the group names itself from this id.
        <Label id={labelIdOf(nameID)} htmlFor={type === 'checkbox' ? nameID : undefined}>
          {label}
        </Label>
      )}
      {description !== undefined && description !== '' && <p className='mb-2'>{description}</p>}
      <FieldInput
        nameID={nameID}
        label={label}
        type={type}
        {...rest}
        aria-invalid={messages.some((message) => message.level === 'error')}
        aria-describedby={messages.length > 0 ? messagesId : undefined}
      />
      {/* Always rendered and never display:none, so screen readers announce messages as they appear. */}
      <div id={messagesId} aria-live='polite'>
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
