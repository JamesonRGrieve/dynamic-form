// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import SearchableSelectField from './SearchableSelectField';

const meta: Meta<typeof SearchableSelectField> = {
  title: 'Components/SearchableSelectField',
  component: SearchableSelectField,
};
export default meta;

type Story = StoryObj<typeof SearchableSelectField>;

const ZONES = [
  { value: 'America/New_York', label: '(GMT-05:00) America/New_York' },
  { value: 'America/Regina', label: '(GMT-06:00) America/Regina' },
  { value: 'America/Toronto', label: '(GMT-05:00) America/Toronto' },
  { value: 'Europe/London', label: '(GMT+00:00) Europe/London' },
  { value: 'Europe/Paris', label: '(GMT+01:00) Europe/Paris' },
  { value: 'Asia/Tokyo', label: '(GMT+09:00) Asia/Tokyo' },
];

export const Timezone: Story = {
  render: () => {
    const [value, setValue] = useState('America/Regina');
    return (
      <SearchableSelectField
        id='tz'
        name='tz'
        label='Timezone'
        placeholder='Type a city or region'
        items={ZONES}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('combobox', { name: 'Timezone' });
    await userEvent.click(box);
    await userEvent.keyboard('paris{Enter}');
    await expect(box).toHaveValue('(GMT+01:00) Europe/Paris');
  },
};
