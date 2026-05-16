import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import PasswordField from './PasswordField';

const meta: Meta<typeof PasswordField> = {
  title: 'Components/PasswordField',
  component: PasswordField,
};
export default meta;

type Story = StoryObj<typeof PasswordField>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <PasswordField value={value} onChange={(event) => setValue(event.target.value)} />;
  },
};

export const CustomLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <PasswordField
        id='new-password'
        name='new-password'
        label='Choose a password'
        placeholder='At least 12 characters'
        autoComplete='new-password'
        helperText='Use a mix of letters, numbers, and symbols.'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const TypingHidesValue: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return <PasswordField value={value} onChange={(event) => setValue(event.target.value)} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password') as HTMLInputElement;
    await expect(input.type).toBe('password');
    await userEvent.type(input, 'hunter2');
    await expect(input).toHaveValue('hunter2');
  },
};
