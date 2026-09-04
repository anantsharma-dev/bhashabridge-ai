import React from 'react';
import { cn } from '../../utils/utils';
import { typography, badgeTokens, radius } from './theme';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 'display';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

export const Heading: React.FC<HeadingProps> = ({
  level = 1,
  as,
  className,
  children,
  ...props
}) => {
  const Component = as || (level === 'display' ? 'h1' : `h${level}`);

  const levelStyles = {
    display: `${typography.sizes.display} text-slate-900 dark:text-white`,
    1: `${typography.sizes.h1} text-slate-900 dark:text-white`,
    2: `${typography.sizes.h2} text-slate-900 dark:text-white`,
    3: `${typography.sizes.h3} text-slate-800 dark:text-slate-100`,
    4: `${typography.sizes.h4} text-slate-800 dark:text-slate-100`,
  };

  return (
    <Component
      className={cn(levelStyles[level], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'bodyLg' | 'caption' | 'muted' | 'script-hi' | 'script-ol';
  as?: 'p' | 'span' | 'div';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  as = 'p',
  className,
  children,
  ...props
}) => {
  const Component = as;

  const variantStyles = {
    body: `${typography.sizes.body} text-slate-700 dark:text-slate-300`,
    bodyLg: `${typography.sizes.bodyLg} text-slate-700 dark:text-slate-300`,
    caption: `${typography.sizes.caption} text-slate-500 dark:text-slate-400`,
    muted: typography.sizes.muted,
    'script-hi': typography.scripts.hindiBody,
    'script-ol': typography.scripts.santhaliBody,
  };

  return (
    <Component
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeTokens.variants;
  size?: keyof typeof badgeTokens.sizes;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'blue',
  size = 'md',
  icon,
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        badgeTokens.base,
        badgeTokens.variants[variant],
        badgeTokens.sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

interface LanguageBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  script: 'devanagari' | 'olchiki' | 'english';
  label: string;
  sublabel?: string;
  active?: boolean;
}

export const LanguageBadge: React.FC<LanguageBadgeProps> = ({
  script,
  label,
  sublabel,
  active = false,
  className,
  ...props
}) => {
  const scriptFont = {
    devanagari: typography.classes.fontDevanagari,
    olchiki: typography.classes.fontOlChiki,
    english: typography.classes.fontSans,
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold border transition-all cursor-pointer select-none',
        radius.classes.pill,
        active
          ? 'bg-primary-blue text-white border-primary-blue shadow-sm'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300',
        className
      )}
      {...props}
    >
      <span className={cn('text-sm leading-none', scriptFont[script])}>{label}</span>
      {sublabel && (
        <span className="text-[10px] opacity-75 font-normal">
          ({sublabel})
        </span>
      )}
    </span>
  );
};

