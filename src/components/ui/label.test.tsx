import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Label } from './label';

describe('Label', () => {
  it('renders its children', () => {
    render(<Label>Email</Label>);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('associates with the input via htmlFor', () => {
    render(
      <div>
        <Label htmlFor='email-input'>Email</Label>
        <input id='email-input' />
      </div>,
    );
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email-input');
  });

  it('forwards className', () => {
    render(<Label className='custom-cls'>L</Label>);
    expect(screen.getByText('L').className).toMatch(/custom-cls/);
  });
});
