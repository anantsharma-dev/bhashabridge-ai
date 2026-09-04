import React from 'react';
import { cn } from '../../utils/utils';
import { X } from 'lucide-react';
import { inputTokens } from './theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  script?: 'devanagari' | 'olchiki' | 'default';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onClear,
      script = 'default',
      value,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className={inputTokens.label}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            type={type}
            ref={ref}
            value={value}
            className={cn(
              inputTokens.base,
              error ? inputTokens.borderError : inputTokens.borderNormal,
              leftIcon ? 'pl-11' : 'pl-4',
              rightIcon || onClear ? 'pr-11' : 'pr-4',
              inputTokens.scripts[script],
              className
            )}
            {...props}
          />

          {onClear && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}

          {!onClear && rightIcon && (
            <span className="absolute right-4 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>

        {error ? (
          <p className={inputTokens.error}>{error}</p>
        ) : helperText ? (
          <p className={inputTokens.helper}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  script?: 'devanagari' | 'olchiki' | 'default';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      script = 'default',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className={inputTokens.label}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            inputTokens.base,
            'min-h-[110px] resize-y p-4',
            error ? inputTokens.borderError : inputTokens.borderNormal,
            inputTokens.scripts[script],
            className
          )}
          {...props}
        />
        {error ? (
          <p className={inputTokens.error}>{error}</p>
        ) : helperText ? (
          <p className={inputTokens.helper}>{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

