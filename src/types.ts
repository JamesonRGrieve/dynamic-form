// SPDX-License-Identifier: AGPL-3.0-or-later
/**
 * Shared field types. Kept in a dependency-free leaf module so the individual
 * field components and the `Field` composer can both import them without
 * creating an import cycle (`Field` → `*Field` → `Field`).
 */

/**
 * The minimal event shape every field component emits. Text / password / radio
 * fields forward a real DOM `ChangeEvent`; select and multi-checkbox fields
 * synthesise an event whose `target` carries the new value. Consumers read only
 * `target.name` and `target.value`, so this is the honest contract — no
 * DOM-event cast required. The value type is parameterised: single-value fields
 * emit `string`, multi-checkbox emits `string[]`.
 */
export interface FieldChangeEvent<TValue extends string | string[] = string> {
  target: {
    name: string;
    value: TValue;
  };
}

export type FieldChangeHandler = (event: FieldChangeEvent, nameID: string) => void;

/** What `Field` tells an input about its messages: whether one is an error, and where they are. */
export interface FieldAriaProps {
  'aria-invalid'?: boolean | undefined;
  'aria-describedby'?: string | undefined;
}
