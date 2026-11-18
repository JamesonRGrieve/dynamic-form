// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactElement, useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import SearchableSelectField from './SearchableSelectField';

const ZONES = [
  { value: 'America/New_York', label: '(GMT-05:00) America/New_York' },
  { value: 'America/Regina', label: '(GMT-06:00) America/Regina' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Europe/Paris' },
];

function Harness({ onPick = vi.fn() }: { onPick?: (value: string) => void }): ReactElement {
  const [value, setValue] = useState('America/Regina');
  return (
    <SearchableSelectField
      id='tz'
      name='tz'
      label='Timezone'
      items={ZONES}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onPick(event.target.value);
      }}
    />
  );
}

describe('SearchableSelectField', () => {
  beforeAll(() => {
    // jsdom has no layout, so nothing scrolls; the list scrolls its active match into view.
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('shows the chosen option’s label', () => {
    render(<Harness />);
    expect(screen.getByRole('combobox', { name: 'Timezone' })).toHaveValue('(GMT-06:00) America/Regina');
  });

  it('filters by every typed word, matching across separators', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('combobox', { name: 'Timezone' }));
    await user.keyboard('new york');
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['(GMT-05:00) America/New_York']);
  });

  it('picks the highlighted match with Enter', async () => {
    const onPick = vi.fn();
    const user = userEvent.setup();
    render(<Harness onPick={onPick} />);
    await user.click(screen.getByRole('combobox', { name: 'Timezone' }));
    await user.keyboard('europe{Enter}');
    expect(onPick).toHaveBeenCalledWith('Europe/Paris');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('moves through matches with the arrow keys', async () => {
    const onPick = vi.fn();
    const user = userEvent.setup();
    render(<Harness onPick={onPick} />);
    await user.click(screen.getByRole('combobox', { name: 'Timezone' }));
    await user.keyboard('america{ArrowDown}{Enter}');
    expect(onPick).toHaveBeenCalledWith('America/Regina');
  });

  it('closes on Escape and keeps the current choice', async () => {
    const onPick = vi.fn();
    const user = userEvent.setup();
    render(<Harness onPick={onPick} />);
    const box = screen.getByRole('combobox', { name: 'Timezone' });
    await user.click(box);
    await user.keyboard('paris{Escape}');
    expect(onPick).not.toHaveBeenCalled();
    expect(box).toHaveValue('(GMT-06:00) America/Regina');
    expect(box).toHaveAttribute('aria-expanded', 'false');
  });

  it('says when nothing matches', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('combobox', { name: 'Timezone' }));
    await user.keyboard('zzz');
    expect(screen.getByRole('status')).toHaveTextContent('Nothing matches “zzz”.');
  });
});
