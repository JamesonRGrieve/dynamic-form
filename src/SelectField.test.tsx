// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SelectField from './SelectField';

describe('SelectField', () => {
  it('renders the label', () => {
    render(<SelectField id='s' name='s' label='Color' items={['Red']} value='' onChange={() => undefined} />);
    // Label appears twice — once as the form label, once inside the trigger group.
    expect(screen.getAllByText('Color').length).toBeGreaterThan(0);
  });

  it('renders the placeholder when no value is selected', () => {
    render(<SelectField id='s' name='s' label='Color' items={['Red']} value='' onChange={() => undefined} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('uses custom placeholder when provided', () => {
    render(
      <SelectField
        id='s'
        name='s'
        label='Color'
        items={['Red']}
        value=''
        placeholder='Pick one!'
        onChange={() => undefined}
      />,
    );
    expect(screen.getByText('Pick one!')).toBeInTheDocument();
  });

  it('displays the value when set', () => {
    render(<SelectField id='s' name='s' label='Color' items={['Red', 'Green']} value='Green' onChange={() => undefined} />);
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('associates its label with the picker', () => {
    render(<SelectField id='s' name='s' label='Color' items={['Red', 'Green']} value='Red' onChange={() => undefined} />);
    expect(screen.getByLabelText('Color')).toHaveAttribute('role', 'combobox');
  });

  it('does not rebuild its options when re-rendered with the same items', () => {
    // A form re-renders every field on each keystroke; a long option list (a timezone picker's
    // hundreds) must not be rebuilt for a change elsewhere in the form.
    let labelReads = 0;
    const counted = (value: string): { value: string; label: string } => ({
      value,
      get label() {
        labelReads += 1;
        return value;
      },
    });
    const items = [counted('Red'), counted('Green')];
    const view = render(<SelectField id='s' name='s' label='Color' items={items} value='Red' onChange={() => undefined} />);
    const readsAfterFirstRender = labelReads;
    expect(readsAfterFirstRender).toBeGreaterThan(0);

    view.rerender(<SelectField id='s' name='s' label='Color' items={items} value='Red' onChange={() => undefined} />);
    expect(labelReads).toBe(readsAfterFirstRender);

    view.rerender(<SelectField id='s' name='s' label='Color' items={[...items]} value='Red' onChange={() => undefined} />);
    expect(labelReads).toBeGreaterThan(readsAfterFirstRender);
  });
});
