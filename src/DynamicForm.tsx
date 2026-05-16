import {
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import timezones from 'timezones-list';
import Field from './Field';
import TextField from './TextField';
import { Button } from './components/ui/button';
import { Separator } from './components/ui/separator';
import log from './lib/log';

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
};
export type DynamicFormFieldValueTypes = string | number | boolean;
export type DynamicFormProps = {
  fields?: {
    [key: string]: {
      type: 'text' | 'number' | 'password' | 'boolean';
      display?: string;
      value?: DynamicFormFieldValueTypes;
      validation?: (value: DynamicFormFieldValueTypes) => boolean;
    };
  };
  submitButtonText?: string;
  excludeFields?: string[];
  readOnlyFields?: string[];
  toUpdate?: Record<string, DynamicFormFieldValueTypes>;
  additionalButtons?: ReactNode[];
  onConfirm: (data: { [key: string]: DynamicFormFieldValueTypes }) => void;
};

export default function DynamicForm({
  fields,
  toUpdate,
  excludeFields = [],
  readOnlyFields = [],
  onConfirm,
  submitButtonText = 'Submit',
  additionalButtons = [],
}: DynamicFormProps): ReactElement {
  if (fields === undefined && toUpdate === undefined) {
    throw new Error('Either fields or toUpdate must be provided to DynamicForm.');
  }

  const buildInitialState = useCallback((): { [key: string]: { value: DynamicFormFieldValueTypes; error: string } } => {
    const initialState: { [key: string]: { value: DynamicFormFieldValueTypes; error: string } } = {};
    Object.keys(fields ?? toUpdate ?? {}).forEach((key) => {
      if (!excludeFields.includes(key) && !readOnlyFields.includes(key)) {
        initialState[key] = {
          value: fields ? (fields[key].value ?? typeDefaults[fields[key].type]) : (toUpdate?.[key] ?? ''),
          error: '',
        };
      }
    });
    return initialState;
  }, [fields, toUpdate, excludeFields, readOnlyFields]);

  const [editedState, setEditedState] = useState<{ [key: string]: { value: DynamicFormFieldValueTypes; error: string } }>(
    buildInitialState,
  );
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: string) => {
    setEditedState((prevState) => ({
      ...prevState,
      [id]: { ...prevState[id], value: event.target.value },
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      Object.keys(fields ?? toUpdate ?? {}).forEach((key: string) => {
        try {
          if (fields) {
            if (fields[key].validation?.(editedState[key].value) === true) {
              setEditedState((prevState) => ({ ...prevState, [key]: { ...prevState[key], error: '' } }));
            } else {
              setEditedState((prevState) => ({
                ...prevState,
                [key]: { ...prevState[key], error: 'Invalid value, please double check your input.' },
              }));
            }
          } else if (typeof toUpdate?.[key] === 'number' && Number.isNaN(Number(editedState[key].value))) {
            setEditedState((prevState) => ({
              ...prevState,
              [key]: { ...prevState[key], error: 'Expected a number for this input.' },
            }));
          } else {
            setEditedState((prevState) => ({ ...prevState, [key]: { ...prevState[key], error: '' } }));
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setEditedState((prevState) => ({ ...prevState, [key]: { ...prevState[key], error: message } }));
        }
        e.preventDefault();
      });
      if (Object.values(editedState).every((field) => field.error === '')) {
        const formattedForReturn = Object.fromEntries(Object.entries(editedState).map(([key, value]) => [key, value.value]));
        onConfirm(formattedForReturn);
      }
    },
    [editedState, fields, toUpdate, onConfirm],
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

  return (
    <form className='grid grid-cols-4 gap-4'>
      {Object.entries(editedState).map(([fieldName, fieldObject]) => (
        <div key={fieldName.toLowerCase().replaceAll(' ', '-')} className='col-span-2'>
          {['tz', 'timezone'].includes(fieldName) ? (
            <Field
              nameID={fieldName.toLowerCase().replaceAll(' ', '-')}
              label={fields ? (fields[fieldName].display ?? toTitleCase(fieldName)) : toTitleCase(fieldName)}
              value={fieldObject.value.toString()}
              onChange={handleChange}
              messages={fieldObject.error !== '' ? [{ level: 'error', value: fieldObject.error }] : []}
              type='select'
              items={timezones
                .sort((a, b) => {
                  if (a.utc !== b.utc) {
                    return a.utc > b.utc ? 1 : -1;
                  }
                  return a.tzCode > b.tzCode ? 1 : -1;
                })
                .map((tz) => ({ value: tz.tzCode, label: tz.label }))}
            />
          ) : (
            <Field
              nameID={fieldName.toLowerCase().replaceAll(' ', '-')}
              label={fields ? (fields[fieldName].display ?? toTitleCase(fieldName)) : toTitleCase(fieldName)}
              value={fieldObject.value.toString()}
              onChange={handleChange}
              messages={fieldObject.error !== '' ? [{ level: 'error', value: fieldObject.error }] : []}
              type={
                fields?.[fieldName].type === 'boolean'
                  ? 'checkbox'
                  : fields?.[fieldName].type === 'password' || fieldName.toLowerCase().includes('password')
                    ? 'password'
                    : 'text'
              }
            />
          )}
        </div>
      ))}
      <Button
        className={`col-span-2 ${readOnlyFields.length > 0 && additionalButtons.length > 0 ? 'col-span-2' : ''}`}
        onClick={handleSubmit}
      >
        {submitButtonText}
      </Button>
      {readOnlyFields.length > 0 && <Separator className='col-span-4' />}
      {readOnlyFields.map((fieldName) => {
        const value = toUpdate?.[fieldName];
        if (value === undefined) {
          return null;
        }
        return (
          <div className='col-span-2' key={fieldName.toLowerCase().replaceAll(' ', '-')}>
            <div className='w-full my-4'>
              <TextField
                onChange={() => undefined}
                id={fieldName.toLowerCase().replaceAll(' ', '-')}
                name={fieldName.toLowerCase().replaceAll(' ', '-')}
                label={fields ? (fields[fieldName].display ?? toTitleCase(fieldName)) : toTitleCase(fieldName)}
                value={value.toString()}
                disabled
              />
            </div>
          </div>
        );
      })}

      {additionalButtons}
    </form>
  );
}
