import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PasswordField from './PasswordField';

describe('PasswordField', () => {
  it('renders with default label and password type', () => {
    render(<PasswordField />);
    const input = screen.getByLabelText('Password');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('respects custom label', () => {
    render(<PasswordField label='Choose one' />);
    expect(screen.getByLabelText('Choose one')).toBeInTheDocument();
  });

  it('uses the provided autoComplete', () => {
    render(<PasswordField autoComplete='new-password' />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('reflects the value prop', () => {
    render(<PasswordField value='secret' onChange={() => undefined} />);
    expect(screen.getByLabelText('Password')).toHaveValue('secret');
  });
});
