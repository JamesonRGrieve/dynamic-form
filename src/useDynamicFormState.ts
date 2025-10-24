import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type {
  DynamicFormFieldDefinition,
  FieldState,
  PrimitiveFieldValue,
} from './types';

export type FormState = Record<string, FieldState>;

interface InitializeOptions {
  fields: Record<string, DynamicFormFieldDefinition>;
  toUpdate?: Record<string, PrimitiveFieldValue>;
  exclude: Set<string>;
  readOnly: Set<string>;
}

export interface FormRuntimeField {
  name: string;
  definition: DynamicFormFieldDefinition;
  readOnly: boolean;
}

export interface ValidationOutcome {
  values: Record<string, PrimitiveFieldValue>;
  errors: Record<string, string>;
  isValid: boolean;
}

const typeDefaults: Record<string, PrimitiveFieldValue> = {
  text: '',
  password: '',
  number: 0,
  boolean: false,
  select: '',
  timezone: '',
};

function normalizeValidators(validators: DynamicFormFieldDefinition['validation']) {
  if (!validators) {
    return [];
  }

  return Array.isArray(validators) ? validators : [validators];
}

function initializeFormState({ fields, toUpdate, exclude, readOnly }: InitializeOptions) {
  const runtimeFields: FormRuntimeField[] = [];
  const state: FormState = {};

  Object.entries(fields).forEach(([name, definition]) => {
    if (exclude.has(name)) {
      return;
    }

    const initialValue =
      definition.value ?? toUpdate?.[name] ?? typeDefaults[definition.type] ?? '';

    runtimeFields.push({
      name,
      definition,
      readOnly: readOnly.has(name) || Boolean(definition.readOnly),
    });

    state[name] = {
      value: initialValue,
      error: undefined,
    };
  });

  return { runtimeFields, state };
}

type FormAction =
  | { type: 'update'; name: string; value: PrimitiveFieldValue }
  | { type: 'setErrors'; errors: Record<string, string> }
  | { type: 'reset'; next: FormState };

function formReducer(state: FormState, action: FormAction) {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.name]: { value: action.value, error: undefined },
      };
    case 'setErrors': {
      const nextState: FormState = { ...state };
      Object.entries(action.errors).forEach(([name, message]) => {
        nextState[name] = {
          value: nextState[name]?.value ?? '',
          error: message,
        };
      });
      Object.keys(nextState).forEach((name) => {
        if (!(name in action.errors)) {
          nextState[name] = { value: nextState[name].value, error: undefined };
        }
      });
      return nextState;
    }
    case 'reset':
      return action.next;
    default:
      return state;
  }
}

export function useDynamicFormState(
  fields: Record<string, DynamicFormFieldDefinition>,
  toUpdate: Record<string, PrimitiveFieldValue> | undefined,
  excludeFields: string[],
  readOnlyFields: string[],
) {
  const exclude = useMemo(() => new Set(excludeFields), [excludeFields]);
  const readOnly = useMemo(() => new Set(readOnlyFields), [readOnlyFields]);

  const memoizedInitialization = useMemo(
    () => initializeFormState({ fields, toUpdate, exclude, readOnly }),
    [exclude, fields, readOnly, toUpdate],
  );

  const [state, dispatch] = useReducer(formReducer, memoizedInitialization.state);

  useEffect(() => {
    dispatch({ type: 'reset', next: memoizedInitialization.state });
  }, [memoizedInitialization.state]);

  const setValue = useCallback((name: string, value: PrimitiveFieldValue) => {
    dispatch({ type: 'update', name, value });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    dispatch({ type: 'setErrors', errors });
  }, []);

  return {
    runtimeFields: memoizedInitialization.runtimeFields,
    state,
    setValue,
    setErrors,
  };
}

export function validateForm(
  state: FormState,
  runtimeFields: FormRuntimeField[],
): ValidationOutcome {
  const errors: Record<string, string> = {};
  const values: Record<string, PrimitiveFieldValue> = {};

  runtimeFields.forEach(({ name, definition, readOnly }) => {
    const fieldState = state[name];
    const value = fieldState?.value;
    values[name] = value;

    if (readOnly) {
      return;
    }

    const validators = normalizeValidators(definition.validation);
    const requiredMessage = definition.required ? `${definition.display ?? name} is required.` : undefined;

    if (definition.required) {
      const isEmpty =
        value === '' ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0);
      if (isEmpty) {
        errors[name] = requiredMessage ?? 'This field is required.';
        return;
      }
    }

    for (const validator of validators) {
      const outcome = validator(value);
      if (outcome === false) {
        errors[name] = 'Invalid value, please review your input.';
        return;
      }

      if (typeof outcome === 'object') {
        if (!outcome.valid) {
          errors[name] = outcome.message ?? 'Invalid value, please review your input.';
          return;
        }
      }
    }
  });

  return {
    values,
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
