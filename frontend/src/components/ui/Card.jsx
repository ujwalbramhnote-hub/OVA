import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(function Card({ className, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-[1.5rem] border border-theme bg-surface shadow-[0_10px_24px_rgba(12,15,18,0.08)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
