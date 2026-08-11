// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: 'Click me' } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete' } };
export const Outline: Story = { args: { variant: 'outline', children: 'Outline' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Secondary' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Ghost' } };
export const Link: Story = { args: { variant: 'link', children: 'Link' } };
export const Small: Story = { args: { size: 'sm', children: 'Small' } };
export const Large: Story = { args: { size: 'lg', children: 'Large' } };
export const IconSize: Story = { args: { size: 'icon', children: '!' } };
export const Disabled: Story = { args: { disabled: true, children: 'Disabled' } };

export const ClickCounter: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return <Button onClick={() => setCount((c) => c + 1)}>Clicked: {count}</Button>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await userEvent.click(button);
    await expect(button).toHaveTextContent('Clicked: 2');
  },
};
