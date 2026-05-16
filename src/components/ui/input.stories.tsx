import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Type here…' } };
export const WithValue: Story = { args: { defaultValue: 'Hello' } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Disabled' } };
export const Email: Story = { args: { type: 'email', placeholder: 'you@example.com' } };
export const Number: Story = { args: { type: 'number', placeholder: '0' } };
export const Password: Story = { args: { type: 'password', placeholder: '••••••' } };

export const TypingUpdatesValue: Story = {
  args: { 'aria-label': 'test-input', placeholder: 'Type something' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('test-input') as HTMLInputElement;
    await userEvent.type(input, 'hello');
    await expect(input).toHaveValue('hello');
  },
};
