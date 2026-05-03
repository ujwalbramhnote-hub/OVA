import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const ElectionTicker = ({ label = 'Campaign feed', items = [] }) => {
  const loopItems = items.length ? [...items, ...items] : [];

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-theme bg-elevated">
      <div className="flex items-center justify-between gap-3 border-b border-theme px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 text-accent-hover-theme">
            <Megaphone size={15} />
          </span>
          <div>
            <p className="text-sm font-semibold text-primary-theme">{label}</p>
            <p className="text-xs text-secondary-theme">Election advertising and turnout messaging</p>
          </div>
        </div>
        <span className="rounded-full border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-accent-hover-theme">
          Live
        </span>
      </div>

      <div className="relative overflow-hidden px-4 py-5">
        <motion.div
          className="flex w-max items-stretch gap-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        >
          {loopItems.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`min-w-[260px] max-w-[300px] rounded-2xl border px-5 py-4 ${
                item.tone === 'blue'
                  ? 'border-[color:var(--accent-2)]/25 bg-[color:var(--accent-2)]/8'
                  : 'border-[color:var(--accent)]/25 bg-[color:var(--accent)]/8'
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-theme">{item.badge || 'Campaign message'}</p>
              <p className="mt-2 text-sm font-semibold text-primary-theme">{item.title}</p>
              <p className="mt-1 text-sm leading-5 text-secondary-theme">{item.detail}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ElectionTicker;
