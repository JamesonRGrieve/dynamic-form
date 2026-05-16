import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import DynamicForm from './DynamicForm';

const meta: Meta<typeof DynamicForm> = {
  title: 'Components/DynamicForm',
  component: DynamicForm,
};
export default meta;

type Story = StoryObj<typeof DynamicForm>;

export const FromFieldsSchema: Story = {
  render: () => {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    return (
      <div>
        <DynamicForm
          fields={{
            firstName: { type: 'text', display: 'First Name', value: 'Ada' },
            lastName: { type: 'text', display: 'Last Name', value: 'Lovelace' },
            password: { type: 'password' },
            isAdmin: { type: 'boolean', value: false },
          }}
          onConfirm={(data) => setResult(data)}
        />
        {result && <pre data-testid='result'>{JSON.stringify(result)}</pre>}
      </div>
    );
  },
};

export const FromToUpdate: Story = {
  render: () => {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    return (
      <div>
        <DynamicForm toUpdate={{ firstName: 'Ada', lastName: 'Lovelace', age: 36 }} onConfirm={(data) => setResult(data)} />
        {result && <pre data-testid='result'>{JSON.stringify(result)}</pre>}
      </div>
    );
  },
};

export const ReadOnlyFields: Story = {
  render: () => (
    <DynamicForm
      toUpdate={{ id: 'abc-123', email: 'ada@example.com', name: 'Ada' }}
      readOnlyFields={['id', 'email']}
      onConfirm={() => undefined}
    />
  ),
};

export const ExcludeFields: Story = {
  render: () => (
    <DynamicForm
      toUpdate={{ first: 'one', second: 'two', third: 'three' }}
      excludeFields={['second']}
      onConfirm={() => undefined}
    />
  ),
};

export const WithValidation: Story = {
  render: () => {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    return (
      <div>
        <DynamicForm
          fields={{
            email: {
              type: 'text',
              display: 'Email',
              validation: (value) => typeof value === 'string' && value.includes('@'),
            },
          }}
          onConfirm={(data) => setResult(data)}
        />
        {result && <pre data-testid='result'>{JSON.stringify(result)}</pre>}
      </div>
    );
  },
};

export const SubmitsValidValues: Story = {
  render: () => {
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    return (
      <div>
        <DynamicForm
          fields={{
            name: { type: 'text', display: 'Name', value: 'Ada' },
          }}
          submitButtonText='Save'
          onConfirm={(data) => setResult(data)}
        />
        {result && <pre data-testid='result'>{JSON.stringify(result)}</pre>}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Save' });
    await userEvent.click(button);
    const result = await canvas.findByTestId('result');
    await expect(result).toHaveTextContent('"name":"Ada"');
  },
};
