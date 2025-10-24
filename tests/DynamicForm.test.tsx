import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import DynamicForm from '../src/DynamicForm';
import type { DynamicFormFieldDefinition } from '../src/types';

describe('DynamicForm', () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function render(ui: React.ReactElement) {
    act(() => {
      root.render(ui);
    });
  }

  function changeInput(selector: string, value: string) {
    const input = container.querySelector(selector) as HTMLInputElement;
    if (!input) {
      throw new Error(`Input ${selector} not found`);
    }
    act(() => {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  function changeCheckbox(selector: string, checked: boolean) {
    const input = container.querySelector(selector) as HTMLInputElement;
    if (!input) {
      throw new Error(`Checkbox ${selector} not found`);
    }
    act(() => {
      input.checked = checked;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  it('submits valid values after passing validation', () => {
    const onConfirm = vi.fn();
    const fields: Record<string, DynamicFormFieldDefinition> = {
      name: { type: 'text', display: 'Name', required: true },
      age: {
        type: 'number',
        display: 'Age',
        required: true,
        validation: (value) => ({
          valid: typeof value === 'number' && value >= 18,
          message: 'You must be 18 or older.',
        }),
      },
      subscribed: { type: 'boolean', display: 'Subscribe to updates' },
    };

    render(<DynamicForm fields={fields} onConfirm={onConfirm} />);

    changeInput('input[name="name"]', 'Ada Lovelace');
    changeInput('input[name="age"]', '32');
    changeCheckbox('input[name="subscribed"]', true);

    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Form not rendered');
    }

    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onConfirm).toHaveBeenCalledWith({ name: 'Ada Lovelace', age: 32, subscribed: true });
  });

  it('prevents submission when validation fails', () => {
    const onConfirm = vi.fn();
    const fields: Record<string, DynamicFormFieldDefinition> = {
      code: {
        type: 'number',
        display: 'Access code',
        required: true,
      },
    };

    render(<DynamicForm fields={fields} onConfirm={onConfirm} />);

    changeInput('input[name="code"]', '');

    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Form not rendered');
    }

    act(() => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    const error = container.querySelector('[role="alert"]');
    expect(error?.textContent).toContain('Access code is required.');
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
