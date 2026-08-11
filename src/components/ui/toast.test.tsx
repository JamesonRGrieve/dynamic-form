// SPDX-License-Identifier: AGPL-3.0-or-later
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';

describe('Toast', () => {
  it('renders title and description while open', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Hello</ToastTitle>
          <ToastDescription>World</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('renders the action button with the supplied altText', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>x</ToastTitle>
          <ToastAction altText='Retry the action'>Retry</ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('renders a close button', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>x</ToastTitle>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    // ToastClose carries a `toast-close=""` attribute we can target.
    const closeButton = document.querySelector('[toast-close]');
    expect(closeButton).not.toBeNull();
  });

  it('supports the destructive variant', () => {
    render(
      <ToastProvider>
        <Toast open variant='destructive' data-testid='destr'>
          <ToastTitle>!</ToastTitle>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );
    const el = screen.getByTestId('destr');
    expect(el.className).toMatch(/destructive/);
  });
});
