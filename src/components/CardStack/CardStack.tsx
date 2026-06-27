import { keyframes } from '@emotion/react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, SxProps } from '@mui/material';
import { ReactNode, useEffect } from 'react';

const flyRight = keyframes`
  0%   { transform: scale(1) translateY(0) translateX(0)    rotate(0deg);   opacity: 1; }
  100% { transform: scale(1) translateY(8%) translateX(160%) rotate(22deg);  opacity: 0; }
`;

const flyLeft = keyframes`
  0%   { transform: scale(1) translateY(0) translateX(0)     rotate(0deg);   opacity: 1; }
  100% { transform: scale(1) translateY(8%) translateX(-160%) rotate(-22deg); opacity: 0; }
`;

export type SwipeDirection = 'left' | 'right' | null;

interface CardStackProps<T> {
  items: T[];
  activeIndex: number;
  renderCard: (item: T, isActive: boolean) => ReactNode;
  height?: number | string;
  sx?: SxProps;
  swipeDirection?: SwipeDirection;
  onSwipeAnimationEnd?: () => void;
}

export function CardStack<T>({
  items,
  activeIndex,
  renderCard,
  height = 520,
  sx,
  swipeDirection = null,
  onSwipeAnimationEnd
}: CardStackProps<T>) {
  const visible = items.slice(activeIndex, activeIndex + 3);

  useEffect(() => {
    if (!swipeDirection) return;
    const timer = setTimeout(() => onSwipeAnimationEnd?.(), 380);
    return () => clearTimeout(timer);
  }, [swipeDirection, onSwipeAnimationEnd]);

  if (visible.length === 0) return null;

  const depthStyles = [
    {
      zIndex: 3,
      transform: 'scale(1) translateY(0px)',
      opacity: 1,
      boxShadow: '0 0 0 2px #00d3b0, 0 0 40px rgba(0,211,176,0.35), 0 16px 48px rgba(0,0,0,0.5)'
    },
    {
      zIndex: 2,
      transform: 'scale(0.95) translateY(20px)',
      opacity: 0.65,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    },
    {
      zIndex: 1,
      transform: 'scale(0.90) translateY(40px)',
      opacity: 0.35,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }
  ];

  return (
    <Box sx={{ position: 'relative', height, ...sx }}>
      {[...visible].reverse().map((item, reversedIdx) => {
        const originalIdx = visible.length - 1 - reversedIdx;
        const style = depthStyles[originalIdx] ?? depthStyles[2];
        const isFront = originalIdx === 0;
        const isAnimating = isFront && !!swipeDirection;

        return (
          <Box
            key={activeIndex + originalIdx}
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 2,
              overflow: 'hidden',
              ...(isAnimating
                ? {
                    animation: `${swipeDirection === 'right' ? flyRight : flyLeft} 0.38s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
                    zIndex: style.zIndex,
                    boxShadow: style.boxShadow
                  }
                : {
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    ...style
                  })
            }}
          >
            {renderCard(item, isFront)}

            {/* Swipe stamp overlay */}
            {isFront && swipeDirection && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: swipeDirection === 'right'
                    ? 'rgba(16,217,155,0.18)'
                    : 'rgba(255,93,115,0.18)',
                  animation: 'fadeIn 0.15s ease-out forwards',
                  '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
                  pointerEvents: 'none'
                }}
              >
                <Box
                  sx={{
                    border: `6px solid ${swipeDirection === 'right' ? '#10d99b' : '#ff5d73'}`,
                    borderRadius: '50%',
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: swipeDirection === 'right' ? 'rotate(-12deg)' : 'rotate(12deg)',
                    boxShadow: swipeDirection === 'right'
                      ? '0 0 40px rgba(16,217,155,0.5)'
                      : '0 0 40px rgba(255,93,115,0.5)'
                  }}
                >
                  {swipeDirection === 'right' ? (
                    <CheckIcon sx={{ fontSize: 72, color: '#10d99b', fontWeight: 900 }} />
                  ) : (
                    <CloseIcon sx={{ fontSize: 72, color: '#ff5d73', fontWeight: 900 }} />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
