// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { describedBy, toHtmlId } from './htmlId';

describe('toHtmlId', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(toHtmlId('First Name')).toBe('first-name');
  });

  it('keeps underscores, hyphens and digits', () => {
    expect(toHtmlId('api_key-2')).toBe('api_key-2');
  });

  it('collapses runs of punctuation into one hyphen and trims the ends', () => {
    expect(toHtmlId('!e-mail @ #home$')).toBe('e-mail-home');
  });

  it('falls back when nothing usable remains', () => {
    expect(toHtmlId('!@#$%')).toBe('field');
    expect(toHtmlId('')).toBe('field');
  });
});

describe('describedBy', () => {
  it('joins the ids present', () => {
    expect(describedBy('a', undefined, '', 'b')).toBe('a b');
  });

  it('is undefined when no id is present', () => {
    expect(describedBy(undefined, '')).toBeUndefined();
  });
});
