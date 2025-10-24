import type { ReactNode } from 'react';

export type PrimitiveFieldValue = string | number | boolean | string[];

export type BuiltInFieldType = 'text' | 'number' | 'password' | 'boolean' | 'select' | 'timezone';

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export type FieldValidator = (value: PrimitiveFieldValue) => ValidationResult | boolean;

export interface DynamicFormFieldDefinition {
  type: BuiltInFieldType | string;
  display?: string;
  description?: ReactNode;
  placeholder?: string;
  value?: PrimitiveFieldValue;
  options?: { value: string; label: string }[];
  helperText?: string;
  validation?: FieldValidator | FieldValidator[];
  required?: boolean;
  readOnly?: boolean;
}

export interface DynamicFormProps {
  fields?: Record<string, DynamicFormFieldDefinition>;
  toUpdate?: Record<string, PrimitiveFieldValue>;
  excludeFields?: string[];
  readOnlyFields?: string[];
  submitButtonText?: string;
  additionalButtons?: ReactNode[];
  onConfirm: (data: Record<string, PrimitiveFieldValue>) => void;
  onValidationError?: (errors: Record<string, string>) => void;
  locale?: string;
  timezoneLabelFormatter?: (timezone: { tzCode: string; utc: string; label: string }, locale: string) => string;
}

export interface FieldState {
  value: PrimitiveFieldValue;
  error?: string;
}
