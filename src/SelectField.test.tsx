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
});
