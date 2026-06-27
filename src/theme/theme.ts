import { createTheme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
  h1: { fontWeight: 900 },
  h2: { fontWeight: 900 },
  h3: { fontWeight: 800 },
  h4: { fontWeight: 800 },
  h5: { fontWeight: 700 },
  button: { textTransform: 'none' as const, fontWeight: 800 }
};

const baseShape = { borderRadius: 10 };

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#061327',
      paper: '#0d1c33'
    },
    primary: { main: '#7c4dff' },
    secondary: { main: '#00d3b0' },
    success: { main: '#10d99b' },
    error: { main: '#ff5d73' }
  },
  typography: baseTypography,
  shape: baseShape,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(13, 28, 51, 0.75)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700 }
      }
    }
  }
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f0f4ff',
      paper: '#ffffff'
    },
    primary: { main: '#7c4dff' },
    secondary: { main: '#00a896' },
    success: { main: '#10b981' },
    error: { main: '#ef4444' }
  },
  typography: baseTypography,
  shape: baseShape,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 24px rgba(124,77,255,0.10)',
          border: '1px solid rgba(124,77,255,0.12)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 700 }
      }
    }
  }
});

export const theme = darkTheme;
