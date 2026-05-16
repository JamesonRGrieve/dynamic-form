import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TextField, { type TextFieldProps } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'text' },
    type: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { label: 'Text Field Label', placeholder: 'Enter text...', helperText: 'This is a helper text.' },
  render: (args: TextFieldProps) => {
    const [value, setValue] = useState('');
    return (
      <TextField {...args} id='text-field' name='example' value={value} onChange={(event) => setValue(event.target.value)} />
    );
  },
};

export const WithError: Story = {
  args: { label: 'With error', error: 'This field is required.' },
  render: (args: TextFieldProps) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        id='text-field-error'
        name='example-error'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};

export const PasswordType: Story = {
  args: { label: 'Password', placeholder: 'Enter your password', type: 'password' },
  render: (args: TextFieldProps) => {
    const [value, setValue] = useState('');
    return (
      <TextField
        {...args}
        id='password-field'
        name='password'
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  },
};
