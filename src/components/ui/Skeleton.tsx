import React from 'react';
import { cn } from '../../utils/utils';
import { skeletonTokens, radius } from './theme';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'card' | 'container' | 'full';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = 'card',
  ...props
}) => {
  const roundedStyles = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    card: radius.classes.card,
    container: radius.classes.container,
    full: radius.classes.pill,
  };

  return (
    <div
      className={cn(
        skeletonTokens.base,
        roundedStyles[rounded],
        className
      )}
      {...props}
    />
  );
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(skeletonTokens.card, className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32 rounded-xl" />
      <Skeleton className="h-8 w-8 rounded-xl" />
    </div>
    <Skeleton className="h-4 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4 rounded-lg" />
    <div className="pt-2 flex items-center gap-3">
      <Skeleton className="h-10 w-28 rounded-2xl" />
      <Skeleton className="h-10 w-24 rounded-2xl" />
    </div>
  </div>
);

export const FlashcardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn(skeletonTokens.flashcard, className)}>
    <Skeleton className="w-16 h-16 rounded-full" />
    <Skeleton className="h-6 w-36 rounded-xl" />
    <Skeleton className="h-4 w-24 rounded-lg" />
  </div>
);

export const AudioWaveSkeleton: React.FC<{ count?: number; className?: string }> = ({
  count = 12,
  className,
}) => (
  <div className={cn('flex items-center justify-center gap-1.5 h-12', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'w-1.5 rounded-full',
          i % 3 === 0 ? 'h-10' : i % 2 === 0 ? 'h-6' : 'h-8'
        )}
      />
    ))}
  </div>
);

