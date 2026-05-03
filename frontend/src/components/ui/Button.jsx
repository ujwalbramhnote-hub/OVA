import React from 'react';
import { cn } from '../../utils/cn';

const styles = {
  primary: 'border-transparent bg-accent-theme text-[#111318] shadow-[0_8px_18px_rgba(213,168,83,0.18)] hover:bg-accent-hover-theme',
  secondary: 'border-theme bg-surface text-primary-theme hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/8 hover:text-[color:var(--accent-hover)]',
  ghost: 'border-transparent bg-transparent text-secondary-theme hover:text-primary-theme',
  outline: 'border-theme bg-transparent text-primary-theme hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/6 hover:text-[color:var(--accent-hover)]'
};

const Button = React.forwardRef(function Button(
  { className, variant = 'primary', type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className
      )}
      {...props}
    />
  );
});

export default Button;
