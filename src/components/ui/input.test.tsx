import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input aria-label='field' />);
    const el = screen.getByLabelText('field');
    expect(el.tagName).toBe('INPUT');
  });

  it('respects the type prop', () => {
    render(<Input aria-label='pw' type='password' />);
    expect(screen.getByLabelText('pw')).toHaveAttribute('type', 'password');
  });

  it('renders the placeholder', () => {
    render(<Input placeholder='Type here' />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('reflects controlled value', () => {
    render(<Input aria-label='v' value='abc' onChange={() => undefined} />);
    expect(screen.getByLabelText('v')).toHaveValue('abc');
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input aria-label='v' onChange={onChange} />);
    await user.type(screen.getByLabelText('v'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
