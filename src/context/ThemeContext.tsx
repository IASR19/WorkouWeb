import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from '../theme/theme';

type Mode = 'dark' | 'light';

interface ThemeContextValue {
  mode: Mode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ mode: 'dark', toggleMode: () => {} });

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('dark');

  const toggleMode = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
