import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: 'Email' } };

export const WithInput: Story = {
  render: () => (
    <div className='flex flex-col gap-2'>
      <Label htmlFor='example-input'>Email address</Label>
      <Input id='example-input' type='email' placeholder='you@example.com' />
    </div>
  ),
};

export const LongText: Story = {
  args: { children: 'This is a label with much longer text that wraps onto multiple lines in narrow viewports.' },
};
