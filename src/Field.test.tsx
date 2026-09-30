// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Field from './Field';

describe('Field', () => {
  it('renders a text input by default', () => {
    render(<Field nameID='name' label='Name' />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('renders a password input when type=password', () => {
    render(<Field nameID='pw' label='PW' type='password' />);
    expect(screen.getByLabelText('PW')).toHaveAttribute('type', 'password');
  });

  it('renders the description when provided', () => {
    render(<Field nameID='d' label='Field' description='Helpful hint' />);
    expect(screen.getByText('Helpful hint')).toBeInTheDocument();
  });

  it('renders error-level messages', () => {
    render(<Field nameID='m' label='F' messages={[{ level: 'error', value: 'Boom' }]} />);
    expect(screen.getByText('Boom')).toBeInTheDocument();
  });

  it('renders multiple message levels', () => {
    render(
      <Field
        nameID='m'
        label='F'
        messages={[
          { level: 'warning', value: 'W' },
          { level: 'info', value: 'I' },
          { level: 'success', value: 'S' },
        ]}
      />,
    );
    expect(screen.getByText('W')).toBeInTheDocument();
    expect(screen.getByText('I')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('marks the input invalid and describes it by its messages when one is an error', () => {
    render(<Field nameID='m' label='F' messages={[{ level: 'error', value: 'Boom' }]} />);
    const input = screen.getByLabelText('F');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Boom');
  });

  it('describes but does not invalidate the input for non-error messages', () => {
    render(<Field nameID='m' label='F' messages={[{ level: 'info', value: 'Heads up' }]} />);
    const input = screen.getByLabelText('F');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).toHaveAccessibleDescription('Heads up');
  });

  it('keeps a polite live region for messages even while there are none', () => {
    const { container } = render(<Field nameID='m' label='F' />);
    expect(container.querySelector('#m-messages')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByLabelText('F')).not.toHaveAttribute('aria-describedby');
  });

  it('names a radio group by its visible label and passes its messages on', () => {
    render(
      <Field
        nameID='size'
        label='Size'
        type='radio'
        items={[{ value: 'sm', label: 'Small' }]}
        messages={[{ level: 'error', value: 'Pick one' }]}
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Size' });
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription('Pick one');
  });

  it('marks a select invalid when its message is an error', () => {
    render(
      <Field
        nameID='tz'
        label='Zone'
        type='select'
        items={[{ value: 'UTC', label: 'UTC' }]}
        messages={[{ level: 'error', value: 'Required' }]}
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Zone' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders an explicit label for checkbox type', () => {
    render(<Field nameID='c' label='Agree' type='checkbox' />);
    expect(screen.getAllByText('Agree').length).toBeGreaterThan(0);
  });
});
