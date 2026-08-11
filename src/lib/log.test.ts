// SPDX-License-Identifier: AGPL-3.0-or-later
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import log from './log';

describe('log', () => {
  let spy: MockInstance<typeof console.log>;

  beforeEach(() => {
    spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('does not log when no verbosity option supplied', () => {
    log(['hello']);
    expect(spy).not.toHaveBeenCalled();
  });

  it('logs when required <= threshold (client/browser path)', () => {
    // happy-dom defines window, so this exercises the client branch.
    log(['message'], { client: 1 });
    expect(spy).toHaveBeenCalledWith('message');
  });

  it('suppresses logs above threshold', () => {
    // Default client verbosity is 3; require 10 — should be suppressed.
    log(['message'], { client: 10 });
    expect(spy).not.toHaveBeenCalled();
  });

  it('passes all message arguments through to console.log', () => {
    log(['a', 'b', 'c'], { client: 0 });
    expect(spy).toHaveBeenCalledWith('a', 'b', 'c');
  });
});
