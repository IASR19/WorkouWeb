import { useEffect, useState } from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ForumIcon from '@mui/icons-material/Forum';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { Box, Button, Container, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { WorkouWordmark } from '../WorkouLogo/WorkouLogo';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

const RECRUITER_NAV = [
  { label: 'Candidatos', path: '/recruiter', icon: <PersonSearchIcon /> },
  { label: 'Matches', path: '/matches', icon: <ForumIcon /> },
  { label: 'Minha Empresa', path: '/company', icon: <CorporateFareIcon /> }
];

const CANDIDATE_NAV = [
  { label: 'Vagas', path: '/candidate', icon: <BusinessCenterIcon /> },
  { label: 'Matches', path: '/matches', icon: <ForumIcon /> }
];

export function AppShell() {
  const navigate = useNavigate();
  const { mode, toggleMode } = useAppTheme();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('workou_token');
    if (!token) {
      navigate('/login');
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  if (!authorized) return null;

  const isDark = mode === 'dark';
  const currentUser = api.getCurrentUser();
  const role = currentUser?.role;
  const availableRoles = currentUser?.availableRoles ?? [role];
  const hasMultipleRoles = availableRoles.length > 1;

  const navItems = role === 'recruiter' ? RECRUITER_NAV : CANDIDATE_NAV;

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: isDark
          ? 'radial-gradient(circle at 10% 0%, rgba(124,77,255,0.22), transparent 38%), radial-gradient(circle at 95% 15%, rgba(0,211,176,0.18), transparent 32%), #061327'
          : 'radial-gradient(circle at 10% 0%, rgba(124,77,255,0.10), transparent 38%), radial-gradient(circle at 95% 15%, rgba(0,211,176,0.08), transparent 32%), #f0f4ff'
      }}
    >
      <Box
        component="header"
        sx={{
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,77,255,0.12)'}`,
          bgcolor: isDark ? 'rgba(6,19,39,0.8)' : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center" py={1.5}>
            {/* Logo + role badge */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ filter: 'drop-shadow(0 0 10px rgba(124,77,255,0.4))' }}>
                <WorkouWordmark size="sm" dark={!isDark} />
              </Box>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.3,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  border: `1px solid ${role === 'recruiter' ? 'rgba(124,77,255,0.4)' : 'rgba(0,211,176,0.4)'}`,
                  color: role === 'recruiter' ? '#a78bff' : '#00d3b0',
                  bgcolor: role === 'recruiter' ? 'rgba(124,77,255,0.1)' : 'rgba(0,211,176,0.1)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}
              >
                {role === 'recruiter' ? 'Recrutador' : 'Candidato'}
              </Box>
            </Stack>

            {/* Nav */}
            <Stack direction="row" spacing={1} alignItems="center">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  startIcon={item.icon}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 700,
                    borderRadius: 2,
                    px: 2,
                    '&.active': {
                      color: '#00d3b0',
                      bgcolor: 'rgba(0,211,176,0.08)',
                      boxShadow: 'inset 0 0 0 1px rgba(0,211,176,0.3)'
                    },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  {item.label}
                </Button>
              ))}

              {/* Switch role button if user has multiple roles */}
              {hasMultipleRoles && (
                <Tooltip title="Trocar para outro perfil">
                  <Button
                    size="small"
                    startIcon={<SwapHorizIcon />}
                    onClick={() => {
                      api.logout();
                      navigate('/login');
                    }}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      borderRadius: 2,
                      px: 1.5,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    Trocar perfil
                  </Button>
                </Tooltip>
              )}

              <Tooltip title={isDark ? 'Modo Claro' : 'Modo Escuro'}>
                <IconButton onClick={toggleMode} size="small" sx={{ mx: 0.5, color: 'text.secondary' }}>
                  {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                size="small"
                color="error"
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                Sair
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
