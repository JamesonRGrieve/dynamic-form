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

const EMPTY_STRINGS: readonly string[] = Object.freeze([]);
const EMPTY_NODES: readonly ReactNode[] = Object.freeze([]);

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
  onConfirm: (data: { [key: string]: DynamicFormFieldValueTypes }) => void;
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
}: DynamicFormProps): ReactElement {
  if (fields === undefined && toUpdate === undefined) {
    throw new Error('Either fields or toUpdate must be provided to DynamicForm.');
  }
  // Stabilise array defaults so they don't create fresh references each render
  // (which would invalidate downstream memoised callbacks and loop the effect).
  const excludeFields = excludeFieldsProp ?? EMPTY_STRINGS;
  const readOnlyFields = readOnlyFieldsProp ?? EMPTY_STRINGS;
  const additionalButtons = additionalButtonsProp ?? EMPTY_NODES;

  const buildInitialState = useCallback((): EditedState => {
    const initialState: EditedState = {};
    Object.keys(fields ?? toUpdate ?? {}).forEach((key) => {
      if (excludeFields.includes(key) || readOnlyFields.includes(key)) {
        return;
      }
      let initial: DynamicFormFieldValueTypes;
      if (fields !== undefined) {
        const spec = fields[key];
        // The default tsconfig's index signature claims spec is always defined
        // (so ESLint flags the undefined check); tsconfig.strict.json's
        // noUncheckedIndexedAccess disagrees. Guard for both.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        initial = spec === undefined ? '' : (spec.value ?? typeDefaults[spec.type]);
      } else {
        initial = toUpdate?.[key] ?? '';
      }
      initialState[key] = { value: initial, error: '' };
    });
    return initialState;
  }, [fields, toUpdate, excludeFields, readOnlyFields]);

  const [editedState, setEditedState] = useState<EditedState>(buildInitialState);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, id: string) => {
    setEditedState((prevState) => ({
      ...prevState,
      [id]: { ...getEntry(prevState, id), value: event.target.value },
    }));
  }, []);

  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      Object.keys(fields ?? toUpdate ?? {}).forEach((key: string) => {
        try {
          if (fields !== undefined) {
            const spec: DynamicFormFieldSpec | undefined = fields[key];
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- noUncheckedIndexedAccess sees spec as possibly undefined
            const valid = spec?.validation?.(getEntry(editedState, key).value) === true;
            if (valid) {
              setEditedState((prevState) => ({ ...prevState, [key]: { ...getEntry(prevState, key), error: '' } }));
            } else {
              setEditedState((prevState) => ({
                ...prevState,
                [key]: { ...getEntry(prevState, key), error: 'Invalid value, please double check your input.' },
              }));
            }
          } else if (typeof toUpdate?.[key] === 'number' && Number.isNaN(Number(getEntry(editedState, key).value))) {
            setEditedState((prevState) => ({
              ...prevState,
              [key]: { ...getEntry(prevState, key), error: 'Expected a number for this input.' },
            }));
          } else {
            setEditedState((prevState) => ({ ...prevState, [key]: { ...getEntry(prevState, key), error: '' } }));
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          setEditedState((prevState) => ({ ...prevState, [key]: { ...getEntry(prevState, key), error: message } }));
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

  function fieldDisplay(fieldName: string): string {
    return fields?.[fieldName]?.display ?? toTitleCase(fieldName);
  }

  function fieldKind(fieldName: string): 'checkbox' | 'password' | 'text' {
    const t = fields?.[fieldName]?.type;
    if (t === 'boolean') {
      return 'checkbox';
    }
    if (t === 'password' || fieldName.toLowerCase().includes('password')) {
      return 'password';
    }
    return 'text';
  }

  return (
    <form className='grid grid-cols-4 gap-4'>
      {Object.entries(editedState).map(([fieldName, fieldObject]) => (
        <div key={fieldName.toLowerCase().replaceAll(' ', '-')} className='col-span-2'>
          {['tz', 'timezone'].includes(fieldName) ? (
            <Field
              nameID={fieldName.toLowerCase().replaceAll(' ', '-')}
              label={fieldDisplay(fieldName)}
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
              label={fieldDisplay(fieldName)}
              value={fieldObject.value.toString()}
              onChange={handleChange}
              messages={fieldObject.error !== '' ? [{ level: 'error', value: fieldObject.error }] : []}
              type={fieldKind(fieldName)}
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
                label={fieldDisplay(fieldName)}
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
