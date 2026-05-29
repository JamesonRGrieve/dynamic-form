import { describe, expect, expectTypeOf, it } from 'vitest';
import type { FieldChangeEvent, FieldChangeHandler } from './types';

describe('FieldChangeEvent', () => {
  it('defaults its value type to string', () => {
    const event: FieldChangeEvent = { target: { name: 'field', value: 'hello' } };
    expectTypeOf<FieldChangeEvent['target']['value']>().toEqualTypeOf<string>();
    expectTypeOf<FieldChangeEvent['target']['name']>().toEqualTypeOf<string>();
    expect(event.target.value).toBe('hello');
    expect(event.target.name).toBe('field');
  });

  it('carries a string[] value when parameterised for multi-select', () => {
    const event: FieldChangeEvent<string[]> = { target: { name: 'fruits', value: ['Apples', 'Bananas'] } };
    expectTypeOf<FieldChangeEvent<string[]>['target']['value']>().toEqualTypeOf<string[]>();
    expect(event.target.value).toEqual(['Apples', 'Bananas']);
  });
});

describe('FieldChangeHandler', () => {
  it('is a two-arg handler taking a FieldChangeEvent and a name id', () => {
    expectTypeOf<FieldChangeHandler>().parameters.toEqualTypeOf<[FieldChangeEvent, string]>();
    expectTypeOf<FieldChangeHandler>().returns.toEqualTypeOf<void>();
    const received: Array<[string, string]> = [];
    const handler: FieldChangeHandler = (event, nameID) => {
      received.push([String(event.target.value), nameID]);
    };
    handler({ target: { name: 'a', value: 'b' } }, 'a');
    expect(received).toEqual([['b', 'a']]);
  });
});
