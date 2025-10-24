import type { DetailedHTMLProps, LabelHTMLAttributes } from 'react';

export type LabelProps = DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;

export function Label({ className = '', ...rest }: LabelProps) {
  return (
    <label
      {...rest}
      className={[
        'text-sm font-medium text-gray-900',
        className,
      ]
        .join(' ')
        .trim()}
    />
  );
}
