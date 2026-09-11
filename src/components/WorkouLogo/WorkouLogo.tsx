type LogoMarkProps = { size?: number };

export function WorkouLogoMark({ size = 48 }: LogoMarkProps) {
  return <img src="/logo-workou.png" alt="Workou" width={size} height={size} style={{ display: 'block' }} />;
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
  const textColor = dark ? '#0B1220' : '#ffffff';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, userSelect: 'none' }}>
      <WorkouLogoMark size={iconSize} />
      <span style={{ fontWeight: 900, fontSize, letterSpacing: '-0.02em', lineHeight: 1 }}>
        <span style={{ color: textColor }}>Work</span>
        <span
          style={{
            background: 'linear-gradient(90deg, #5B3DF5, #22D3EE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ou
        </span>
      </span>
    </div>
  );
}
