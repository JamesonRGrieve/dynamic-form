// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RadioField from './RadioField';

describe('RadioField', () => {
  it('renders string items', () => {
    render(<RadioField id='r' name='r' value='' onChange={() => undefined} items={['One', 'Two', 'Three']} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('renders object items with labels', () => {
    render(
      <RadioField
        id='r'
        name='r'
        value=''
        onChange={() => undefined}
        items={[
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta' },
        ]}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('marks the matching item checked', () => {
    render(<RadioField id='r' name='r' value='Two' onChange={() => undefined} items={['One', 'Two']} />);
    const two = screen.getByDisplayValue('Two') as HTMLInputElement;
    expect(two.checked).toBe(true);
  });

  it('emits onChange when an item is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RadioField id='r' name='r' value='' onChange={onChange} items={['One', 'Two']} />);
    await user.click(screen.getByText('Two'));
    expect(onChange).toHaveBeenCalled();
  });

  it('exposes a radiogroup role', () => {
    render(<RadioField id='r' name='r' value='' onChange={() => undefined} items={['x']} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });
});
