'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later
import { type ReactElement, type ReactNode, type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Field from './Field';
import TextField from './TextField';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import { toHtmlId } from './lib/htmlId';
import log from './lib/log';
import { timezoneOptions } from './lib/timezones';
import type { FieldChangeEvent } from './types';

const EMPTY_STRINGS: readonly string[] = Object.freeze([]);
const EMPTY_NODES: readonly ReactNode[] = Object.freeze([]);

/** The validation messages the form shows; each can be replaced, e.g. for translation. */
export type DynamicFormErrorMessages = {
  /** A field's `validation` rejected its value. */
  invalidValue: string;
  /** A field seeded with a number (via `toUpdate`) holds something that is not one. */
  expectedNumber: string;
};

const DEFAULT_ERROR_MESSAGES: DynamicFormErrorMessages = {
  invalidValue: 'Invalid value, please double check your input.',
  expectedNumber: 'Expected a number for this input.',
};
/** Field names rendered as a timezone picker. */
const TIMEZONE_FIELDS: readonly string[] = ['tz', 'timezone'];

export function toTitleCase(input: string): string {
  // Replace underscores, or capital letters (in the middle of the string) with a space and the same character.
  const spaced = input.replace(/(_)|((?<=\w)[A-Z])/g, ' $&').replace(/_/g, '');
  return spaced.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

const typeDefaults = {
  text: '',
  password: '',
  number: 0,
  boolean: false,
} as const;

export type DynamicFormFieldValueTypes = string | number | boolean;

type DynamicFormFieldSpec = {
  type: 'text' | 'number' | 'password' | 'boolean';
  display?: string;
  value?: DynamicFormFieldValueTypes;
  validation?: (value: DynamicFormFieldValueTypes) => boolean;
};

export type DynamicFormProps = {
  fields?: {
    [key: string]: DynamicFormFieldSpec;
  };
  submitButtonText?: string;
  excludeFields?: string[];
  readOnlyFields?: string[];
  toUpdate?: Record<string, DynamicFormFieldValueTypes>;
  additionalButtons?: ReactNode[];
  /** Names the editable fields as a group. */
  legend?: string;
  /** Names the read-only fields as a group. */
  readOnlyLegend?: string;
  errorMessages?: Partial<DynamicFormErrorMessages>;
  /** Returning a promise disables the form until it settles. */
  onConfirm: (data: { [key: string]: DynamicFormFieldValueTypes }) => void | Promise<void>;
};

type FieldEntry = { value: DynamicFormFieldValueTypes; error: string };
type EditedState = { [key: string]: FieldEntry };

const EMPTY_ENTRY: FieldEntry = { value: '', error: '' };

function getEntry(state: EditedState, key: string): FieldEntry {
  return state[key] ?? EMPTY_ENTRY;
}

export default function DynamicForm({
  fields,
  toUpdate,
  excludeFields: excludeFieldsProp,
  readOnlyFields: readOnlyFieldsProp,
  onConfirm,
  submitButtonText = 'Submit',
  additionalButtons: additionalButtonsProp,
  legend,
  readOnlyLegend,
  errorMessages,
}: DynamicFormProps): ReactElement {
  if (fields === undefined && toUpdate === undefined) {
    throw new Error('Either fields or toUpdate must be provided to DynamicForm.');
  }
  // Stabilise array defaults so they don't create fresh references each render
  // (which would invalidate downstream memoised callbacks and loop the effect).
  const excludeFields = excludeFieldsProp ?? EMPTY_STRINGS;
  const readOnlyFields = readOnlyFieldsProp ?? EMPTY_STRINGS;
  const additionalButtons = additionalButtonsProp ?? EMPTY_NODES;
  const invalidValue = errorMessages?.invalidValue ?? DEFAULT_ERROR_MESSAGES.invalidValue;
  const expectedNumber = errorMessages?.expectedNumber ?? DEFAULT_ERROR_MESSAGES.expectedNumber;
  const [submitting, setSubmitting] = useState(false);

  const specs = useMemo(() => new Map<string, DynamicFormFieldSpec>(Object.entries(fields ?? {})), [fields]);

  const buildInitialState = useCallback((): EditedState => {
    const initialState: EditedState = {};
    Object.keys(fields ?? toUpdate ?? {}).forEach((key) => {
      if (excludeFields.includes(key) || readOnlyFields.includes(key)) {
        return;
      }
      let initial: DynamicFormFieldValueTypes;
      if (fields !== undefined) {
        const spec = specs.get(key);
        initial = spec === undefined ? '' : (spec.value ?? typeDefaults[spec.type]);
      } else {
        initial = toUpdate?.[key] ?? '';
      }
      initialState[key] = { value: initial, error: '' };
    });
    return initialState;
  }, [fields, specs, toUpdate, excludeFields, readOnlyFields]);

  const [editedState, setEditedState] = useState<EditedState>(buildInitialState);
  const chosenTimezones = Object.entries(editedState)
    .filter(([fieldName]) => TIMEZONE_FIELDS.includes(fieldName))
    .map(([, entry]) => entry.value.toString())
    .join(',');
  const timezones = useMemo(() => timezoneOptions(new Date(), chosenTimezones.split(',')), [chosenTimezones]);

  // Boolean fields keep a boolean; their checkbox reports "true"/"false".
  const handleChange = useCallback(
    (event: FieldChangeEvent, id: string) => {
      const value = specs.get(id)?.type === 'boolean' ? event.target.value === 'true' : event.target.value;
      setEditedState((prevState) => ({
        ...prevState,
        [id]: { ...getEntry(prevState, id), value },
      }));
    },
    [specs],
  );

  const fieldError = useCallback(
    (key: string, value: DynamicFormFieldValueTypes): string => {
      try {
        if (fields !== undefined) {
          const validation = specs.get(key)?.validation;
          return validation === undefined || validation(value) ? '' : invalidValue;
        }
        return typeof toUpdate?.[key] === 'number' && Number.isNaN(Number(value)) ? expectedNumber : '';
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    },
    [fields, specs, toUpdate, invalidValue, expectedNumber],
  );

  // Validate against the values being submitted, not the last render's errors,
  // so an invalid value can never slip through on the first click.
  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const validated: EditedState = Object.fromEntries(
        Object.entries(editedState).map(([key, entry]) => [key, { ...entry, error: fieldError(key, entry.value) }]),
      );
      setEditedState(validated);
      if (!Object.values(validated).every((entry) => entry.error === '')) {
        return;
      }
      const result = onConfirm(Object.fromEntries(Object.entries(validated).map(([key, entry]) => [key, entry.value])));
      if (result instanceof Promise) {
        setSubmitting(true);
        // A rejection is the caller's to handle; it still propagates.
        void result.finally(() => {
          setSubmitting(false);
        });
      }
    },
    [editedState, fieldError, onConfirm],
  );

  // Re-seed state when the incoming props change. The lazy initialiser
  // handles the first render; this effect handles subsequent prop swaps.
  // React 19's preferred pattern is keying the parent component, but
  // we don't control the consumer.
  useEffect(() => {
    const next = buildInitialState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedState(next);
    log(['Setting initial dynamic form state', next], { client: 2 });
  }, [buildInitialState]);

  function fieldDisplay(fieldName: string): string {
    return specs.get(fieldName)?.display ?? toTitleCase(fieldName);
  }

  function fieldKind(fieldName: string): 'checkbox' | 'password' | 'select' | 'text' {
    if (TIMEZONE_FIELDS.includes(fieldName)) {
      return 'select';
    }
    const t = specs.get(fieldName)?.type;
    if (t === 'boolean') {
      return 'checkbox';
    }
    if (t === 'password' || fieldName.toLowerCase().includes('password')) {
      return 'password';
    }
    return 'text';
  }

  return (
    <form className='grid grid-cols-4 gap-4' aria-busy={submitting}>
      {/* display:contents keeps the fields on the form's grid while grouping them. */}
      <fieldset className='contents' disabled={submitting}>
        {legend !== undefined && <legend className='col-span-4 text-lg font-medium'>{legend}</legend>}
        {Object.entries(editedState).map(([fieldName, fieldObject]) => {
          const kind = fieldKind(fieldName);
          return (
            <div key={fieldName} className='col-span-2'>
              <Field
                nameID={toHtmlId(fieldName)}
                label={fieldDisplay(fieldName)}
                value={fieldObject.value.toString()}
                onChange={(event) => {
                  handleChange(event, fieldName);
                }}
                messages={fieldObject.error !== '' ? [{ level: 'error', value: fieldObject.error }] : []}
                type={kind}
                {...(kind === 'select' ? { items: timezones } : {})}
              />
            </div>
          );
        })}
        <Button className='col-span-2' onClick={handleSubmit} disabled={submitting}>
          {submitButtonText}
        </Button>
      </fieldset>
      {readOnlyFields.length > 0 && <Separator className='col-span-4' />}
      {readOnlyFields.length > 0 && (
        // Not disabled as a group: each read-only input is disabled itself.
        <fieldset className='contents'>
          {readOnlyLegend !== undefined && <legend className='col-span-4 text-lg font-medium'>{readOnlyLegend}</legend>}
          {readOnlyFields.map((fieldName) => {
            const value = toUpdate?.[fieldName];
            if (value === undefined) {
              return null;
            }
            return (
              <div className='col-span-2' key={fieldName}>
                <div className='w-full my-4'>
                  <TextField
                    onChange={() => undefined}
                    id={toHtmlId(fieldName)}
                    name={toHtmlId(fieldName)}
                    label={fieldDisplay(fieldName)}
                    value={value.toString()}
                    disabled
                  />
                </div>
              </div>
            );
          })}
        </fieldset>
      )}

      {additionalButtons}
    </form>
  );
}
