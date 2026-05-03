import React from 'react';
import { motion } from 'framer-motion';
import { Check, Vote } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { resolveImageSrc } from '../../utils/image';
import { cn } from '../../utils/cn';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const CandidateCard = ({ candidate, selected, voted, onSelect }) => {
  const imageSrc = resolveImageSrc(candidate.profileImageUrl || candidate.imageUrl);
  const initials = getInitials(candidate.name);
  const quote = candidate.description || candidate.manifesto || 'Focused on secure elections and accountable governance.';

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
      <Card className={cn('h-full overflow-hidden p-6 transition-colors', selected ? 'border-[color:var(--accent)] bg-[color:var(--surface-2)]/50' : 'hover:border-[color:var(--accent)]/35')}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[color:var(--accent)] via-[color:var(--accent-hover)] to-[color:var(--accent-2)] opacity-80" />

        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-theme bg-elevated">
            {imageSrc ? (
              <img src={imageSrc} alt={candidate.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-semibold text-accent-hover-theme">{initials}</span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="truncate text-lg font-semibold text-primary-theme">{candidate.name}</h3>
                <p className="mt-1 text-sm text-secondary-theme">{candidate.party || 'Independent'}</p>
              </div>
              {selected ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-3 py-1 text-xs font-medium text-accent-hover-theme">
                  <Check size={12} />
                  Selected
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <p className="mt-5 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-secondary-theme">{quote}</p>

        <div className="mt-6 flex items-center justify-between gap-3 border-t border-theme pt-4">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-theme">{voted ? 'Vote submitted' : selected ? 'Ready to submit' : 'Available'}</div>
          <Button variant={selected ? 'primary' : 'outline'} onClick={() => onSelect(candidate)} className="min-w-[118px]" disabled={voted}>
            <Vote size={16} />
            {voted ? 'Submitted' : selected ? 'Cast Vote' : 'Vote'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CandidateCard;
