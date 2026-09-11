import type { ReactNode } from 'react';
import { Box } from '@mui/material';

import { useReveal } from './useReveal';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  sx?: object;
};

export function Reveal({ children, delay = 0, y = 22, sx }: RevealProps) {
  const { ref, visible } = useReveal();

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.7s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        ...sx
      }}
    >
      {children}
    </Box>
  );
}
