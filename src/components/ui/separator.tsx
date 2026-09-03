'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import type { ComponentProps, JSX } from 'react';
import { cn } from '../../lib/utils';

export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>;

export function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: SeparatorProps): JSX.Element {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]', className)}
      {...props}
    />
  );
}
