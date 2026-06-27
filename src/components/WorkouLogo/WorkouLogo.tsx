type LogoMarkProps = { size?: number };

export function WorkouLogoMark({ size = 48 }: LogoMarkProps) {
  const id = `wk-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c4dff" />
          <stop offset="100%" stopColor="#00d3b0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M32 2 A30 30 0 1 1 31.999 2Z" />
        </clipPath>
      </defs>

      {/* Outer circle with gradient */}
      <circle cx="32" cy="32" r="30" fill={`url(#${id}-bg)`} />

      {/* Left person — head */}
      <circle cx="20" cy="17" r="6.5" fill="white" opacity="0.95" />
      {/* Left person — body reaching right */}
      <path
        d="M8 46 C8 34 16 30 22 31 L29 37 L22 44 C16 47 8 47 8 46Z"
        fill="white"
        opacity="0.95"
      />

      {/* Right person — head */}
      <circle cx="44" cy="17" r="6.5" fill="white" opacity="0.80" />
      {/* Right person — body reaching left */}
      <path
        d="M56 46 C56 34 48 30 42 31 L35 37 L42 44 C48 47 56 47 56 46Z"
        fill="white"
        opacity="0.80"
      />

      {/* Handshake / connection dot at center */}
      <circle cx="32" cy="36" r="3.5" fill="white" opacity="0.9" />

      {/* Speech bubble notch at bottom */}
      <path d="M25 60 L32 67 L39 60" fill={`url(#${id}-bg)`} />
    </svg>
  );
}

type WordmarkProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
};

const sizeMap = {
  sm: { fontSize: '1.1rem', gap: '6px', iconSize: 28 },
  md: { fontSize: '1.5rem', gap: '10px', iconSize: 36 },
  lg: { fontSize: '2rem', gap: '12px', iconSize: 48 },
  xl: { fontSize: '3rem', gap: '16px', iconSize: 68 },
};

export function WorkouWordmark({ size = 'md', dark = false }: WordmarkProps) {
  const { fontSize, gap, iconSize } = sizeMap[size];
  const textColor = dark ? '#0a1628' : '#ffffff';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, userSelect: 'none' }}>
      <WorkouLogoMark size={iconSize} />
      <span style={{ fontWeight: 900, fontSize, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <span style={{ color: textColor }}>Work</span>
        <span style={{ color: '#00d3b0' }}>ou</span>
      </span>
    </div>
  );
}
