import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders horizontally by default', () => {
    const { container } = render(<Separator />);
    const el = container.firstElementChild;
    if (!(el instanceof HTMLElement)) {
      throw new Error('expected an HTMLElement');
    }
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('renders vertically when orientation=vertical', () => {
    const { container } = render(<Separator orientation='vertical' />);
    const el = container.firstElementChild;
    if (!(el instanceof HTMLElement)) {
      throw new Error('expected an HTMLElement');
    }
    expect(el.getAttribute('data-orientation')).toBe('vertical');
  });

  it('forwards className', () => {
    const { container } = render(<Separator className='custom' />);
    const el = container.firstElementChild;
    if (!(el instanceof HTMLElement)) {
      throw new Error('expected an HTMLElement');
    }
    expect(el.className).toMatch(/custom/);
  });
});
