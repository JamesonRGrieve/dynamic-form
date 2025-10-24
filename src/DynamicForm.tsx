import type { FormEvent, ReactNode } from 'react';
import { useCallback, useMemo } from 'react';
import { Button } from './primitives/Button';
import { Separator } from './primitives/Separator';
import { Field } from './Field';
import { TextField } from './TextField';
import { useDynamicFormState, validateForm } from './useDynamicFormState';
import type { DynamicFormFieldDefinition, DynamicFormProps, PrimitiveFieldValue } from './types';
import { toDisplayLabel } from './utils/text';
import { getSortedTimezones } from './utils/timezone';

const TIMEZONE_FIELD_NAMES = new Set(['tz', 'timezone']);

function inferFieldDefinition(value: PrimitiveFieldValue): DynamicFormFieldDefinition {
  switch (typeof value) {
    case 'number':
      return { type: 'number' };
    case 'boolean':
      return { type: 'boolean' };
    default:
      return { type: 'text' };
  }
}

function ensureFields(fields: DynamicFormProps['fields'], toUpdate: DynamicFormProps['toUpdate'], locale: string) {
  if (fields && Object.keys(fields).length > 0) {
    return fields;
  }

  if (!toUpdate) {
    throw new Error('Either fields or toUpdate must be provided to DynamicForm.');
  }

  return Object.fromEntries(
    Object.entries(toUpdate).map(([key, value]) => [
      key,
      {
        ...inferFieldDefinition(value),
        display: toDisplayLabel(key, locale),
        value,
      } satisfies DynamicFormFieldDefinition,
    ]),
  );
}

function coerceValue(value: string | boolean | string[], definition: DynamicFormFieldDefinition): PrimitiveFieldValue {
  if (definition.type === 'number') {
    const numericValue = typeof value === 'number' ? value : Number(value);
    return Number.isNaN(numericValue) ? '' : numericValue;
  }

  if (definition.type === 'boolean') {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true' || value === true;
  }

  return value;
}

export default function DynamicForm({
  fields: incomingFields,
  toUpdate,
  excludeFields = [],
  readOnlyFields = [],
  onConfirm,
  submitButtonText = 'Submit',
  additionalButtons = [],
  onValidationError,
  locale = 'en',
  timezoneLabelFormatter,
}: DynamicFormProps) {
  const fields = useMemo(
    () => ensureFields(incomingFields, toUpdate, locale),
    [incomingFields, locale, toUpdate],
  );

  const { runtimeFields, state, setValue, setErrors } = useDynamicFormState(fields, toUpdate, excludeFields, readOnlyFields);

  const timezoneOptions = useMemo(() => {
    const formatter = timezoneLabelFormatter ?? ((tz: { label: string; utc: string }) => `${tz.label} (${tz.utc})`);
    return getSortedTimezones().map((timezone) => ({
      value: timezone.tzCode,
      label: formatter(timezone, locale),
    }));
  }, [locale, timezoneLabelFormatter]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const result = validateForm(state, runtimeFields);
      if (!result.isValid) {
        setErrors(result.errors);
        onValidationError?.(result.errors);
        console.warn('DynamicForm submission blocked due to validation errors.', { fields: Object.keys(result.errors) });
        return;
      }

      setErrors({});
      onConfirm(result.values);
    },
    [onConfirm, onValidationError, runtimeFields, setErrors, state],
  );

  const handleChange = useCallback(
    (name: string, value: PrimitiveFieldValue) => {
      const definition = fields[name];
      if (!definition) {
        return;
      }

      const coercedValue = coerceValue(value, definition);
      setValue(name, coercedValue);
    },
    [fields, setValue],
  );

  const renderField = useCallback(
    (field: typeof runtimeFields[number]) => {
      const fieldState = state[field.name];
      const errorMessage = fieldState?.error;
      const baseType = field.definition.type;
      const isBoolean = baseType === 'boolean';
      const isPassword = baseType === 'password' || field.name.toLowerCase().includes('password');
      const isTimezone = baseType === 'timezone' || TIMEZONE_FIELD_NAMES.has(field.name.toLowerCase());

      let fieldType: 'text' | 'password' | 'select' | 'checkbox';
      if (isBoolean) {
        fieldType = 'checkbox';
      } else if (isPassword) {
        fieldType = 'password';
      } else if (isTimezone || baseType === 'select') {
        fieldType = 'select';
      } else {
        fieldType = 'text';
      }

      const label = field.definition.display ?? toDisplayLabel(field.name, locale);
      const helperText = field.definition.helperText;
      const placeholder = field.definition.placeholder;

      const valueForField: string | boolean | string[] = (() => {
        if (isBoolean) {
          return Boolean(fieldState?.value);
        }
        if (Array.isArray(fieldState?.value)) {
          return fieldState?.value;
        }
        return fieldState?.value?.toString() ?? '';
      })();

      const items = (() => {
        if (isTimezone) {
          return timezoneOptions;
        }
        if (field.definition.options) {
          return field.definition.options;
        }
        return undefined;
      })();

      return (
        <Field
          key={field.name}
          nameID={field.name.toLowerCase().replace(/\s+/g, '-')}
          label={label}
          description={field.definition.description}
          type={fieldType}
          value={valueForField}
          onChange={(val) => handleChange(field.name, val as PrimitiveFieldValue)}
          items={items}
          messages={errorMessage ? [{ level: 'error', value: errorMessage }] : []}
          helperText={helperText}
          placeholder={placeholder}
          disabled={field.readOnly}
        />
      );
    },
    [fields, handleChange, locale, runtimeFields, state, timezoneOptions],
  );

  const readOnlyFieldEntries = useMemo(
    () => runtimeFields.filter((field) => field.readOnly),
    [runtimeFields],
  );

  const editableFieldEntries = useMemo(
    () => runtimeFields.filter((field) => !field.readOnly),
    [runtimeFields],
  );

  return (
    <form className='grid grid-cols-4 gap-4' onSubmit={handleSubmit} noValidate>
      {editableFieldEntries.map((field) => renderField(field))}

      <div className='col-span-4 flex flex-wrap gap-2'>
        <Button type='submit' className='min-w-[120px]'>
          {submitButtonText}
        </Button>
        {additionalButtons.map((button: ReactNode, index: number) => (
          <span key={index} className='inline-flex'>
            {button}
          </span>
        ))}
      </div>

      {readOnlyFieldEntries.length > 0 && <Separator />}

      {readOnlyFieldEntries.map((field) => {
        const displayValue = state[field.name]?.value;
        return (
          <div key={`readonly-${field.name}`} className='col-span-2'>
            <TextField
              id={`readonly-${field.name}`}
              name={`readonly-${field.name}`}
              label={field.definition.display ?? toDisplayLabel(field.name, locale)}
              value={displayValue?.toString() ?? ''}
              disabled
            />
          </div>
        );
      })}
    </form>
  );
}
