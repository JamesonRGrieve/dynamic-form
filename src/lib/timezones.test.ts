// SPDX-License-Identifier: AGPL-3.0-or-later
import { describe, expect, it } from 'vitest';
import { timezoneOptions } from './timezones';

const WINTER = new Date('2026-01-15T12:00:00Z');
const SUMMER = new Date('2026-07-15T12:00:00Z');

const labelOf = (zone: string, at: Date): string | undefined =>
  timezoneOptions(at).find((option) => option.value === zone)?.label;

describe('timezoneOptions', () => {
  it('always offers UTC, labelled with a zero offset', () => {
    expect(labelOf('UTC', WINTER)).toBe('(GMT+00:00) UTC');
  });

  it('labels each zone with its offset at the given moment, so daylight saving shows', () => {
    expect(labelOf('America/Edmonton', WINTER)).toBe('(GMT-07:00) America/Edmonton');
    expect(labelOf('America/Edmonton', SUMMER)).toBe('(GMT-06:00) America/Edmonton');
    expect(labelOf('America/Buenos_Aires', WINTER)).toBe('(GMT-03:00) America/Buenos Aires');
  });

  it('adds valid zones the runtime lists under another name, and ignores unknown ones', () => {
    const values = timezoneOptions(WINTER, ['Asia/Kolkata', 'Mars/Olympus_Mons']).map((option) => option.value);
    expect(values).toContain('Asia/Kolkata');
    expect(values).not.toContain('Mars/Olympus_Mons');
  });

  it('orders west to east, then by name within an offset', () => {
    const values = timezoneOptions(WINTER).map((option) => option.value);
    expect(values.indexOf('Pacific/Honolulu')).toBeLessThan(values.indexOf('America/Edmonton'));
    expect(values.indexOf('America/Edmonton')).toBeLessThan(values.indexOf('UTC'));
    expect(values.indexOf('UTC')).toBeLessThan(values.indexOf('Asia/Tokyo'));
    expect(values.indexOf('Asia/Calcutta')).toBeLessThan(values.indexOf('Asia/Katmandu'));
  });

  it('lists every zone exactly once', () => {
    const values = timezoneOptions(WINTER).map((option) => option.value);
    expect(new Set(values).size).toBe(values.length);
  });
});
