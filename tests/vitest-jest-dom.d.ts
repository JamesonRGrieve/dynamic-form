// SPDX-License-Identifier: AGPL-3.0-or-later
// jest-dom 7 still augments vitest 4's one-parameter `Assertion<T>`; vitest 5 declares
// `Assertion<R, T>` and exposes `Matchers<R, T>` as the extension point, so jest-dom's own
// augmentation no longer merges. Register its matchers on vitest 5's interface instead.
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- T must be declared to merge with vitest's Matchers<R, T>
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends TestingLibraryMatchers<
    unknown,
    R
  > {}
}
