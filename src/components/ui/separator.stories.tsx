// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className='w-64'>
      <div>Above</div>
      <Separator />
      <div>Below</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className='flex items-center gap-4 h-16'>
      <div>Left</div>
      <Separator orientation='vertical' />
      <div>Right</div>
    </div>
  ),
};

export const NonDecorative: Story = {
  render: () => (
    <div className='w-64'>
      <Separator decorative={false} />
    </div>
  ),
};
