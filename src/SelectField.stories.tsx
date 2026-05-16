import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SelectField from './SelectField';

const meta: Meta<typeof SelectField> = {
  title: 'Components/SelectField',
  component: SelectField,
};
export default meta;

type Story = StoryObj<typeof SelectField>;

export const StringItems: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SelectField
        id='color'
        name='color'
        label='Color'
        items={['Red', 'Green', 'Blue']}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const ObjectItems: Story = {
  render: () => {
    const [value, setValue] = useState('opt-1');
    return (
      <SelectField
        id='choice'
        name='choice'
        label='Choice'
        placeholder='Pick one'
        items={[
          { value: 'opt-1', label: 'Option 1' },
          { value: 'opt-2', label: 'Option 2' },
          { value: 'opt-3', label: 'Option 3' },
        ]}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const EmptyItems: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <SelectField
        id='empty'
        name='empty'
        label='Nothing to pick'
        items={[]}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const PreselectedValue: Story = {
  render: () => {
    const [value, setValue] = useState('Green');
    return (
      <SelectField
        id='preselected'
        name='preselected'
        label='Pre-selected'
        items={['Red', 'Green', 'Blue']}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};
