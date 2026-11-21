// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button, buttonVariants } from './button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Hello</Button>);
    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('honours the disabled prop', () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders as a Slot when asChild is set', () => {
    render(
      <Button asChild>
        <a href='/somewhere'>Link</a>
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Link' })).toBeInTheDocument();
  });

  it('spaces an icon from its label, and never squeezes the icon', () => {
    render(
      <Button>
        <svg aria-hidden />
        Download
      </Button>,
    );
    // Without a gap the icon touched its word ("[icon]Download"); a long label can't shrink the icon.
    expect(screen.getByRole('button', { name: 'Download' })).toHaveClass('gap-2', '[&_svg]:shrink-0');
  });

  it('applies variant classes via buttonVariants', () => {
    const cls = buttonVariants({ variant: 'destructive', size: 'lg' });
    expect(cls).toMatch(/destructive/);
    expect(cls).toMatch(/h-11/);
  });
});
