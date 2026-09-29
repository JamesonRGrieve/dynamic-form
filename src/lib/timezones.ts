// SPDX-License-Identifier: AGPL-3.0-or-later

export interface TimezoneOption {
  /** IANA zone name, e.g. `America/Edmonton`. */
  value: string;
  /** Offset and readable name, e.g. `(GMT-06:00) America/Edmonton`. */
  label: string;
}

const UTC = 'UTC';
const UTC_OFFSET = 'GMT+00:00';
const MINUTES_PER_HOUR = 60;
const OFFSET_PATTERN = /^GMT(?<sign>[+-])(?<hours>\d{2}):(?<minutes>\d{2})$/;

/** The zone's offset at `at` as `GMT±HH:MM` (Intl reports UTC itself as bare `GMT`). */
const offsetOf = (zone: string, at: Date): string => {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: zone, timeZoneName: 'longOffset' })
    .formatToParts(at)
    .find((part) => part.type === 'timeZoneName')?.value;
  return name === undefined || name === 'GMT' ? UTC_OFFSET : name;
};

const offsetMinutes = (offset: string): number => {
  const groups = OFFSET_PATTERN.exec(offset)?.groups;
  if (groups === undefined) {
    return 0;
  }
  const magnitude = Number(groups['hours']) * MINUTES_PER_HOUR + Number(groups['minutes']);
  return groups['sign'] === '-' ? -magnitude : magnitude;
};

const isKnownZone = (zone: string): boolean => {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: zone }).resolvedOptions().timeZone !== '';
  } catch {
    return false;
  }
};

/**
 * Every timezone the runtime knows, west to east and then by name, labelled with its
 * offset at `at` (so daylight saving is reflected). UTC is always offered, as is each valid
 * zone in `include`: the runtime lists canonical names only (`Asia/Calcutta`), so a stored
 * alias such as `Asia/Kolkata` would otherwise have no option to select.
 */
export function timezoneOptions(at: Date = new Date(), include: readonly string[] = []): TimezoneOption[] {
  const zones = [...new Set([UTC, ...Intl.supportedValuesOf('timeZone'), ...include.filter(isKnownZone)])];
  return zones
    .map((zone) => ({ zone, offset: offsetOf(zone, at) }))
    .sort((a, b) => offsetMinutes(a.offset) - offsetMinutes(b.offset) || a.zone.localeCompare(b.zone))
    .map(({ zone, offset }) => ({ value: zone, label: `(${offset}) ${zone.replaceAll('_', ' ')}` }));
}
