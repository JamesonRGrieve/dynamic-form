import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('skips falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('handles conditional objects', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b');
  });

  it('merges tailwind classes (overrides win)', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles arrays', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('returns empty string for no input', () => {
    expect(cn()).toBe('');
  });
});
