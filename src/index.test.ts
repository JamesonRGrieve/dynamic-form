import { describe, expect, it } from 'vitest';
import * as api from './index';

describe('public api surface', () => {
  it('exports DynamicForm', () => {
    expect(api.DynamicForm).toBeDefined();
  });

  it('exports Field and the field components', () => {
    expect(api.Field).toBeDefined();
    expect(api.TextField).toBeDefined();
    expect(api.PasswordField).toBeDefined();
    expect(api.SelectField).toBeDefined();
    expect(api.RadioField).toBeDefined();
    expect(api.CheckField).toBeDefined();
  });

  it('exports toTitleCase, cn, log', () => {
    expect(typeof api.toTitleCase).toBe('function');
    expect(typeof api.cn).toBe('function');
    expect(typeof api.log).toBe('function');
  });

  it('exports useToast and toast', () => {
    expect(typeof api.useToast).toBe('function');
    expect(typeof api.toast).toBe('function');
  });
});
