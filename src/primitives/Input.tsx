import type { DetailedHTMLProps, ForwardedRef, InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

function BaseInput({ className = '', ...rest }: InputProps, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <input
      {...rest}
      ref={ref}
      className={[
        'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100',
        className,
      ]
        .join(' ')
        .trim()}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(BaseInput);
Input.displayName = 'Input';
