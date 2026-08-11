// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TextField from './TextField';

describe('TextField', () => {
  it('renders label and input', () => {
    render(<TextField id='x' name='x' label='Name' />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<TextField id='x' name='x' label='Name' onChange={onChange} />);
    await user.type(screen.getByLabelText('Name'), 'hi');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders the error message when error is a string', () => {
    render(<TextField id='x' name='x' label='Name' error='Required' />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders helperText when there is no error', () => {
    render(<TextField id='x' name='x' label='Name' helperText='Helpful' />);
    expect(screen.getByText('Helpful')).toBeInTheDocument();
  });

  it('hides helperText when an error is present', () => {
    render(<TextField id='x' name='x' label='Name' helperText='Helpful' error='Bad' />);
    expect(screen.queryByText('Helpful')).not.toBeInTheDocument();
    expect(screen.getByText('Bad')).toBeInTheDocument();
  });

  it('respects type prop (password)', () => {
    render(<TextField id='x' name='x' label='PW' type='password' />);
    expect(screen.getByLabelText('PW')).toHaveAttribute('type', 'password');
  });
});
