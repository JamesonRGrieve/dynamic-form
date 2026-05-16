import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import CheckField from './CheckField';

const meta: Meta<typeof CheckField> = {
  title: 'Components/CheckField',
  component: CheckField,
};
export default meta;

type Story = StoryObj<typeof CheckField>;

export const SingleUnchecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckField
        id='accept-terms'
        name='accept-terms'
        label='Accept terms'
        helperText='I agree to the terms'
        value={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};

export const SingleChecked: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <CheckField
        id='subscribe'
        name='subscribe'
        label='Subscribe'
        value={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
};

export const MultiCheckboxes: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['Apples']);
    return (
      <CheckField
        id='fruits'
        name='fruits'
        label='Fruits'
        items={['Apples', 'Bananas', 'Cherries']}
        value={selected}
        onChange={(event) => {
          // CheckField multi-mode synthesises a ChangeEvent whose target.value is
          // the new string[]; the HTMLInputElement typing can't express that.
          // eslint-disable-next-line no-restricted-syntax -- intentional cross-boundary cast
          const value = event.target.value as unknown as string[];
          setSelected(value);
        }}
      />
    );
  },
};

export const SingleToggleInteractive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <CheckField
        id='toggle'
        name='toggle'
        label='Toggle me'
        helperText='Click to toggle'
        value={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole('checkbox');
    await expect(box).not.toBeChecked();
    await userEvent.click(box);
    await expect(box).toBeChecked();
  },
};
