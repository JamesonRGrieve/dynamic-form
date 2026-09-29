// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import DynamicForm, { toTitleCase } from './DynamicForm';

describe('toTitleCase', () => {
  it('title-cases simple words', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('splits camelCase into spaced words', () => {
    expect(toTitleCase('firstName')).toBe('First Name');
  });

  it('splits snake_case into spaced words', () => {
    expect(toTitleCase('first_name')).toBe('First Name');
  });
});

describe('DynamicForm', () => {
  it('throws when neither fields nor toUpdate is supplied', () => {
    // Suppress React's error log for this expected throw.
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<DynamicForm onConfirm={() => undefined} />)).toThrow(/Either fields or toUpdate/);
    errSpy.mockRestore();
  });

  it('renders an input per field', () => {
    render(
      <DynamicForm
        fields={{
          firstName: { type: 'text', display: 'First Name', value: 'Ada' },
          lastName: { type: 'text', display: 'Last Name', value: 'Lovelace' },
        }}
        onConfirm={() => undefined}
      />,
    );
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });

  it('excludes fields named in excludeFields', () => {
    render(
      <DynamicForm
        fields={{
          shown: { type: 'text', display: 'Shown' },
          hidden: { type: 'text', display: 'Hidden' },
        }}
        excludeFields={['hidden']}
        onConfirm={() => undefined}
      />,
    );
    expect(screen.getByLabelText('Shown')).toBeInTheDocument();
    expect(screen.queryByLabelText('Hidden')).not.toBeInTheDocument();
  });

  it('renders readOnly fields as disabled inputs', () => {
    render(<DynamicForm toUpdate={{ id: 'abc-123', name: 'Ada' }} readOnlyFields={['id']} onConfirm={() => undefined} />);
    const idInput = screen.getByLabelText('Id') as HTMLInputElement;
    expect(idInput.disabled).toBe(true);
  });

  it('uses the supplied submit button text', () => {
    render(
      <DynamicForm fields={{ a: { type: 'text', value: 'x' } }} submitButtonText='Persist' onConfirm={() => undefined} />,
    );
    expect(screen.getByRole('button', { name: 'Persist' })).toBeInTheDocument();
  });

  it('invokes onConfirm with the field values on submit', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DynamicForm fields={{ name: { type: 'text', display: 'Name', value: 'Ada' } }} onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({ name: 'Ada' }));
  });

  it('blocks the first submit of an invalid value and shows why', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(
      <DynamicForm
        fields={{
          name: { type: 'text', display: 'Name', value: '', validation: (value) => value !== '' },
          nickname: { type: 'text', display: 'Nickname', value: 'Ace' },
        }}
        onConfirm={onConfirm}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid value, please double check your input.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Name'), 'Ada');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onConfirm).toHaveBeenCalledWith({ name: 'Ada', nickname: 'Ace' });
    expect(screen.queryByText('Invalid value, please double check your input.')).not.toBeInTheDocument();
  });

  it('toggles a boolean field both ways and submits it as a boolean', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DynamicForm fields={{ enabled: { type: 'boolean', display: 'Enabled', value: true } }} onConfirm={onConfirm} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onConfirm).toHaveBeenLastCalledWith({ enabled: false });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onConfirm).toHaveBeenLastCalledWith({ enabled: true });
  });

  it('renders a timezone field as a labelled picker showing the current zone', () => {
    render(<DynamicForm fields={{ timezone: { type: 'text', value: 'Asia/Kolkata' } }} onConfirm={() => undefined} />);
    expect(screen.getByLabelText('Timezone')).toHaveTextContent('Asia/Kolkata');
  });

  it('rejects a non-numeric value for a numeric toUpdate field', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DynamicForm toUpdate={{ age: 3 }} onConfirm={onConfirm} />);
    await user.clear(screen.getByLabelText('Age'));
    await user.type(screen.getByLabelText('Age'), 'three');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText('Expected a number for this input.')).toBeInTheDocument();
  });
});
