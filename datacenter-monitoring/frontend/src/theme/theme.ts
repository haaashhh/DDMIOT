import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9bb5ff',
      dark: '#3b4ab8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#764ba2',
      light: '#a478d2',
      dark: '#4a2272',
      contrastText: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#7f8c8d',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.1)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.1)',
    '0px 16px 32px rgba(0,0,0,0.1)',
    '0px 20px 40px rgba(0,0,0,0.1)',
    '0px 24px 48px rgba(0,0,0,0.1)',
    '0px 32px 64px rgba(0,0,0,0.12)',
    '0px 40px 80px rgba(0,0,0,0.12)',
    '0px 48px 96px rgba(0,0,0,0.12)',
    '0px 56px 112px rgba(0,0,0,0.12)',
    '0px 64px 128px rgba(0,0,0,0.12)',
    '0px 72px 144px rgba(0,0,0,0.12)',
    '0px 80px 160px rgba(0,0,0,0.12)',
    '0px 88px 176px rgba(0,0,0,0.12)',
    '0px 96px 192px rgba(0,0,0,0.12)',
    '0px 104px 208px rgba(0,0,0,0.12)',
    '0px 112px 224px rgba(0,0,0,0.12)',
    '0px 120px 240px rgba(0,0,0,0.12)',
    '0px 128px 256px rgba(0,0,0,0.12)',
    '0px 136px 272px rgba(0,0,0,0.12)',
    '0px 144px 288px rgba(0,0,0,0.12)',
    '0px 152px 304px rgba(0,0,0,0.12)',
    '0px 160px 320px rgba(0,0,0,0.12)'
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 24px',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;