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

  it('renders an explicit label for checkbox type', () => {
    render(<Field nameID='c' label='Agree' type='checkbox' />);
    expect(screen.getAllByText('Agree').length).toBeGreaterThan(0);
  });
});
