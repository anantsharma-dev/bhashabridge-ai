import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/utils';
import { buttonTokens, motionPresets } from './theme';

export type ButtonVariant = keyof typeof buttonTokens.variants;
export type ButtonSize = keyof typeof buttonTokens.sizes;

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  tactile?: boolean; // Duolingo 3D bottom bevel effect
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      tactile = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isTactileEligible = tactile && variant in buttonTokens.tactile;
    const resolvedStyle = isTactileEligible
      ? `${buttonTokens.variants[variant]} ${buttonTokens.tactile[variant as keyof typeof buttonTokens.tactile]}`
      : buttonTokens.variants[variant];

    return (
      <motion.button
        ref={ref}
        whileTap={isTactileEligible ? undefined : motionPresets.tap}
        transition={motionPresets.spring}
        disabled={disabled || loading}
        className={cn(
          buttonTokens.base,
          resolvedStyle,
          buttonTokens.sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

