// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RadioField from './RadioField';

describe('RadioField', () => {
  it('renders string items', () => {
    render(<RadioField id='r' name='r' label='Pick' value='' onChange={() => undefined} items={['One', 'Two', 'Three']} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('Three')).toBeInTheDocument();
  });

  it('renders object items with labels', () => {
    render(
      <RadioField
        id='r'
        name='r'
        label='Pick'
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
    render(<RadioField id='r' name='r' label='Pick' value='Two' onChange={() => undefined} items={['One', 'Two']} />);
    expect(screen.getByRole('radio', { name: 'Two' })).toBeChecked();
  });

  it('emits onChange when an item is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RadioField id='r' name='r' label='Pick' value='' onChange={onChange} items={['One', 'Two']} />);
    await user.click(screen.getByText('Two'));
    expect(onChange).toHaveBeenCalled();
  });

  it('is named by its label when nothing visible names it', () => {
    render(<RadioField id='r' name='r' label='Size' value='' onChange={() => undefined} items={['x']} />);
    expect(screen.getByRole('radiogroup', { name: 'Size' })).toBeInTheDocument();
  });

  it('is named by the element aria-labelledby points at, over its label', () => {
    render(
      <>
        <span id='heading'>Shirt size</span>
        <RadioField
          id='r'
          name='r'
          label='Size'
          aria-labelledby='heading'
          value=''
          onChange={() => undefined}
          items={['x']}
        />
      </>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Shirt size' })).toBeInTheDocument();
  });

  it('can be chosen from the keyboard', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<RadioField id='r' name='r' label='Pick' value='' onChange={onChange} items={['One', 'Two']} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'One' })).toHaveFocus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalled();
  });

  it('gives each option an id scoped to its group, so two groups never collide', () => {
    render(
      <>
        <RadioField id='a' name='a' label='A' value='' onChange={() => undefined} items={['Yes!']} />
        <RadioField id='b' name='b' label='B' value='' onChange={() => undefined} items={['Yes!']} />
      </>,
    );
    const ids = screen.getAllByRole('radio', { name: 'Yes!' }).map((radio) => radio.id);
    expect(ids).toEqual(['a-yes', 'b-yes']);
  });
});
