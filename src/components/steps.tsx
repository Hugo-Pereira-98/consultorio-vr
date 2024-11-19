// components/steps.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface StepsProps {
  value: number;
  className?: string;
  children: React.ReactNode;
}

interface StepsItemProps {
  title: string;
  icon: React.ElementType;
}

export function Steps({ value, className, children }: StepsProps) {
  const items = React.Children.toArray(children);

  return (
    <div className={cn('relative space-y-4', className)}>
      <div className="flex justify-between">
        {items.map((item, index) => {
          const isActive = index <= value;
          return React.cloneElement(item as React.ReactElement, {
            isActive,
            isCompleted: index < value,
            step: index + 1,
            key: index,
          });
        })}
      </div>
    </div>
  );
}

export function StepsItem({
  title,
  icon: Icon,
  isActive,
  isCompleted,
}: StepsItemProps & {
  isActive?: boolean;
  isCompleted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors',
          isActive
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span
        className={cn(
          'text-xs font-medium',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        {title}
      </span>
    </div>
  );
}
