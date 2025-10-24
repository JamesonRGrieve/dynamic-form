import type { ButtonHTMLAttributes, DetailedHTMLProps, ForwardedRef } from 'react';
import { forwardRef } from 'react';

export type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  loading?: boolean;
};

function BaseButton({ loading = false, children, disabled, type = 'button', ...rest }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300',
        rest.className ?? '',
      ]
        .join(' ')
        .trim()}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(BaseButton);
Button.displayName = 'Button';
