// SPDX-License-Identifier: AGPL-3.0-or-later
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <div className='grid gap-1'>
          <ToastTitle>Scheduled: Catch up</ToastTitle>
          <ToastDescription>Friday, February 10, 2023 at 5:57 PM</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Destructive: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant='destructive'>
        <div className='grid gap-1'>
          <ToastTitle>Something went wrong</ToastTitle>
          <ToastDescription>Please try again later.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <div className='grid gap-1'>
          <ToastTitle>Email sent</ToastTitle>
          <ToastDescription>The invitation is on its way.</ToastDescription>
        </div>
        <ToastAction altText='Undo'>Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
