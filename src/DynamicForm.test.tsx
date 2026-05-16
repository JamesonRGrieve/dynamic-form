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
});
