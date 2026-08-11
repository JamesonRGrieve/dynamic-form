// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className='w-64'>
        <SelectValue placeholder='Pick a fruit' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value='apple'>Apple</SelectItem>
          <SelectItem value='banana'>Banana</SelectItem>
          <SelectItem value='cherry'>Cherry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('apple');
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className='w-64'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='apple'>Apple</SelectItem>
          <SelectItem value='banana'>Banana</SelectItem>
        </SelectContent>
      </Select>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className='w-64'>
        <SelectValue placeholder='Disabled' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='one'>One</SelectItem>
      </SelectContent>
    </Select>
  ),
};
