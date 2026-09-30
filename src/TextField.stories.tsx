// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import TextField, { type TextFieldProps } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    type: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { label: 'Text Field Label', placeholder: 'Enter text...', helperText: 'This is a helper text.' },
  render: (args: TextFieldProps) => {
    const [value, setValue] = useState('');
    return (
      <TextField {...args} id='text-field' name='example' value={value} onChange={(event) => setValue(event.target.value)} />
    );
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Text Field Label');
    await userEvent.type(input, 'Hello');
    await expect(input).toHaveValue('Hello');
    await expect(input).toHaveAccessibleDescription('This is a helper text.');
  },
};

export const WithError: Story = {
  args: { label: 'With error', error: 'This field is required.' },
  render: (args: TextFieldProps) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        id='text-field-error'
        name='example-error'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('With error');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('This field is required.');
  },
};

export const PasswordType: Story = {
  args: { label: 'Password', placeholder: 'Enter your password', type: 'password' },
  render: (args: TextFieldProps) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        id='password-field'
        name='password'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Password');
    await expect(input).toHaveAttribute('type', 'password');
    await userEvent.type(input, 'hunter2');
    await expect(input).toHaveValue('hunter2');
  },
};
