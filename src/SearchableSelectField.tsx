'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later
import { type KeyboardEvent as ReactKeyboardEvent, type ReactElement, useId, useMemo, useRef, useState } from 'react';
import type { SelectItemOption } from './SelectField';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import type { FieldAriaProps, FieldChangeEvent } from './types';

interface SearchableSelectFieldProps extends FieldAriaProps {
  id: string;
  value: string;
  onChange: (event: FieldChangeEvent) => void;
  items: SelectItemOption[];
  name: string;
  label: string;
  placeholder?: string;
}

/** How many matches the list shows at once; typing narrows the rest. */
const MOST_SHOWN = 50;

const optionValueOf = (item: SelectItemOption): string => (typeof item === 'string' ? item : item.value);
const optionLabelOf = (item: SelectItemOption): string => (typeof item === 'string' ? item : (item.label ?? item.value));

/** Lower-cased, with separators as spaces, so "new york" finds "America/New_York". */
const searchable = (text: string): string => text.toLowerCase().replace(/[_/-]+/g, ' ');

/**
 * A choice from a long list (a timezone, a country) that the user finds by typing: an ARIA
 * combobox whose text box filters a listbox. Up and Down move through the matches, Enter picks,
 * Escape closes and restores the current choice. Typing never sets a value on its own: only a
 * picked option does, so the field always holds one of `items`.
 */
export default function SearchableSelectField({
  id,
  value,
  onChange,
  items,
  name,
  label,
  placeholder = 'Type to search',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}: SearchableSelectFieldProps): ReactElement {
  const listId = useId();
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const open = query !== null;

  const options = useMemo(
    () =>
      items.map((item) => ({
        value: optionValueOf(item),
        label: optionLabelOf(item),
        key: searchable(optionLabelOf(item)),
      })),
    [items],
  );
  const chosen = options.find((option) => option.value === value);
  const matches = useMemo(() => {
    const words = searchable(query ?? '')
      .split(' ')
      .filter((word) => word !== '');
    return options.filter((option) => words.every((word) => option.key.includes(word))).slice(0, MOST_SHOWN);
  }, [options, query]);

  const pick = (optionValue: string): void => {
    onChange({ target: { value: optionValue, name } });
    setQuery(null);
  };
  const move = (to: number): void => {
    const next = Math.max(0, Math.min(matches.length - 1, to));
    setActive(next);
    listRef.current?.children.item(next)?.scrollIntoView({ block: 'nearest' });
  };
  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (open) move(active + 1);
      else setQuery('');
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(active - 1);
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      const match = matches.at(active);
      if (match !== undefined) pick(match.value);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setQuery(null);
    }
  };

  return (
    <div className='relative flex w-full flex-col gap-2 mb-4'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        role='combobox'
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete='list'
        aria-activedescendant={open && matches.at(active) !== undefined ? `${listId}-${String(active)}` : undefined}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        autoComplete='off'
        spellCheck={false}
        placeholder={chosen?.label ?? placeholder}
        value={query ?? chosen?.label ?? ''}
        onFocus={(event) => {
          event.currentTarget.select();
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onClick={() => {
          if (!open) setQuery('');
        }}
        onBlur={() => {
          setQuery(null);
        }}
        onKeyDown={onKeyDown}
      />
      {open && matches.length === 0 && (
        <p
          role='status'
          className='absolute inset-x-0 top-full z-50 mt-1 rounded-md border bg-popover px-3 py-2 text-sm text-muted-foreground shadow-md'
        >
          Nothing matches “{query}”.
        </p>
      )}
      {open && matches.length > 0 && (
        <div
          ref={listRef}
          id={listId}
          role='listbox'
          aria-label={label}
          className='absolute inset-x-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-md border bg-popover p-1 text-sm text-popover-foreground shadow-md'
        >
          {matches.map((option, index) => (
            // Focus stays in the text box (aria-activedescendant); an option is focusable only by script.
            <div
              key={option.value}
              id={`${listId}-${String(index)}`}
              role='option'
              tabIndex={-1}
              aria-selected={option.value === value}
              data-active={index === active ? '' : undefined}
              // mousedown, not click: picking must happen before the text box's blur closes the list.
              onMouseDown={(event) => {
                event.preventDefault();
                pick(option.value);
              }}
              onMouseMove={() => setActive(index)}
              className='cursor-default rounded-sm px-2 py-1.5 data-active:bg-accent data-active:text-accent-foreground aria-selected:font-medium'
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
