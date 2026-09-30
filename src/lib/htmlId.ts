// SPDX-License-Identifier: AGPL-3.0-or-later
const NON_ID_CHARACTERS = /[^a-z0-9_-]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;
/** The id used when a name has no characters an id can keep. */
const FALLBACK_ID = 'field';

/** A lowercase HTML id for a field or option name: runs of other characters become one hyphen. */
export function toHtmlId(name: string): string {
  const id = name.toLowerCase().replace(NON_ID_CHARACTERS, '-').replace(EDGE_HYPHENS, '');
  return id === '' ? FALLBACK_ID : id;
}

/** An `aria-describedby` value from the ids present, or undefined when there are none. */
export function describedBy(...ids: (string | undefined)[]): string | undefined {
  const present = ids.filter((id): id is string => id !== undefined && id !== '');
  return present.length > 0 ? present.join(' ') : undefined;
}
