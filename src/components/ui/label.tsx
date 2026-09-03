'use client';
// SPDX-License-Identifier: AGPL-3.0-or-later

import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ComponentProps, JSX } from 'react';
import { cn } from '../../lib/utils';

const labelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70');

export type LabelProps = ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>;

export function Label({ className, ...props }: LabelProps): JSX.Element {
  return <LabelPrimitive.Root data-slot='label' className={cn(labelVariants(), className)} {...props} />;
}
