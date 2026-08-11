// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Field from './Field';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Text: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Field
        nameID='username'
        label='Username'
        description='Pick something memorable.'
        type='text'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const Password: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Field
        nameID='password'
        label='Password'
        type='password'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const Select: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Field
        nameID='color'
        label='Color'
        type='select'
        items={[
          { value: 'red', label: 'Red' },
          { value: 'green', label: 'Green' },
          { value: 'blue', label: 'Blue' },
        ]}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const Checkbox: Story = {
  render: () => {
    const [value, setValue] = useState('false');
    return (
      <Field
        nameID='agree'
        label='I agree'
        type='checkbox'
        value={value}
        onChange={() => setValue((prev) => (prev === 'true' ? 'false' : 'true'))}
      />
    );
  },
};

export const Radio: Story = {
  render: () => {
    const [value, setValue] = useState('A');
    return (
      <Field
        nameID='choice'
        label='Choice'
        type='radio'
        items={[
          { value: 'A', label: 'Alpha' },
          { value: 'B', label: 'Beta' },
        ]}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const WithErrorMessage: Story = {
  render: () => {
    const [value, setValue] = useState('bad');
    return (
      <Field
        nameID='email'
        label='Email'
        type='text'
        value={value}
        onChange={(event) => setValue(event.target.value)}
        messages={[{ level: 'error', value: 'Please enter a valid email.' }]}
      />
    );
  },
};

export const WithWarningInfoSuccess: Story = {
  render: () => {
    const [value, setValue] = useState('value');
    return (
      <Field
        nameID='multi'
        label='Multi'
        type='text'
        value={value}
        onChange={(event) => setValue(event.target.value)}
        messages={[
          { level: 'warning', value: 'Heads up: this field is special.' },
          { level: 'info', value: 'For your information.' },
          { level: 'success', value: 'All good!' },
        ]}
      />
    );
  },
};
