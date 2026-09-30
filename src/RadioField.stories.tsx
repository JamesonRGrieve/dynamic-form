// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import RadioField from './RadioField';

const meta: Meta<typeof RadioField> = {
  title: 'Components/RadioField',
  component: RadioField,
};
export default meta;

type Story = StoryObj<typeof RadioField>;

export const StringItems: Story = {
  render: () => {
    const [value, setValue] = useState('Sm');
    return (
      <RadioField
        id='size'
        name='size'
        label='Size'
        items={['Sm', 'Md', 'Lg']}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const ObjectItems: Story = {
  render: () => {
    const [value, setValue] = useState('chocolate');
    return (
      <RadioField
        id='flavor'
        name='flavor'
        label='Flavor'
        items={[
          { value: 'chocolate', label: 'Chocolate' },
          { value: 'vanilla', label: 'Vanilla' },
          { value: 'strawberry', label: 'Strawberry' },
        ]}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const NoSelection: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <RadioField
        id='blank'
        name='blank'
        label='Answer'
        items={['Yes', 'No', 'Maybe']}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const ClickSelects: Story = {
  render: () => {
    const [value, setValue] = useState('Sm');
    return (
      <RadioField
        id='size-int'
        name='size-int'
        label='Size'
        items={['Sm', 'Md', 'Lg']}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mdLabel = canvas.getByText('Md');
    await userEvent.click(mdLabel);
    await expect(canvas.getByRole('radio', { name: 'Md' })).toBeChecked();
  },
};
