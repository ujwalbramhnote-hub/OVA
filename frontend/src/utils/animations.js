export const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05
    }
  }
};

export const cardHover = {
  y: -6,
  scale: 1.02,
  transition: {
    type: 'spring',
    stiffness: 260,
    damping: 20
  }
};

export const scaleTap = {
  scale: 0.97,
  transition: {
    type: 'spring',
    stiffness: 320,
    damping: 22
  }
};
