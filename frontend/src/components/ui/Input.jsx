import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(function Input(
  { className, label, error, hint, leftIcon, wrapperClassName, ...props },
  ref
) {
  return (
    <label className={cn('block', wrapperClassName)}>
      {label ? <span className="mb-2 block text-sm font-medium text-[#E8EAED]">{label}</span> : null}
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-theme">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-theme bg-elevated px-4 py-3 text-sm text-primary-theme placeholder:text-muted-theme outline-none transition-all duration-200',
            'focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent-2)]/25',
            leftIcon && 'pl-10',
            error && 'border-[#8C4E4E] focus:border-[color:var(--accent-hover)] focus:ring-[#8C4E4E]/20',
            className
          )}
          {...props}
        />
      </div>
      {error ? <p className="mt-2 text-sm text-[#E5A3A3]">{error}</p> : hint ? <p className="mt-2 text-sm text-muted-theme">{hint}</p> : null}
    </label>
  );
});

export default Input;
