import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardContent, CircularProgress,
  Stack, TextField, Typography, IconButton, ThemeProvider
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { WorkouLogoMark } from '../../components/WorkouLogo/WorkouLogo';
import { api } from '../../services/api';
import { darkTheme } from '../../theme/theme';

type Role = 'recruiter' | 'candidate';
type Step = 'role' | 'credentials';

export function LoginPage() {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role>('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSelectRole = (r: Role) => {
    setRole(r);
    setError(null);
    setStep('credentials');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.login(email, password, role);
      navigate(data.user.role === 'recruiter' ? '/recruiter' : '/candidate');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login falhou. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const logoArea = (
    <Stack alignItems="center" spacing={2} mb={4}>
      <WorkouLogoMark size={80} />
      <Typography variant="h3" fontWeight={900} letterSpacing="-0.03em" lineHeight={1}>
        <Box component="span" color="white">Work</Box>
        <Box component="span" color="#22D3EE">ou</Box>
      </Typography>
      <Typography color="text.secondary" variant="body2" textAlign="center" sx={{ fontStyle: 'italic' }}>
        Deu match.{' '}
        <Box component="span" color="#5B3DF5" fontWeight={700} fontStyle="normal">Deu certo.</Box>
        {' '}Workou.
      </Typography>
    </Stack>
  );

  return (
    <ThemeProvider theme={darkTheme}>
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: '#0B1220',
        color: '#fff',
        p: 3
      }}
    >
      <Box width="100%" maxWidth={440}>
        {logoArea}

        {/* STEP 1: choose role */}
        {step === 'role' && (
          <Box>
            <Typography variant="h5" fontWeight={900} textAlign="center" mb={1}>Entrar</Typography>
            <Typography color="text.secondary" textAlign="center" mb={4} variant="body2">
              Qual perfil você quer acessar?
            </Typography>

            <Stack spacing={2}>
              <Card
                onClick={() => handleSelectRole('recruiter')}
                sx={{
                  cursor: 'pointer',
                  border: '2px solid rgba(91,61,245,0.3)',
                  transition: 'border-color 0.18s, transform 0.18s',
                  '&:hover': { borderColor: '#5B3DF5', transform: 'translateY(-1px)' }
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{
                      width: 52, height: 52, borderRadius: '50%',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                      bgcolor: '#5B3DF5'
                    }}>
                      <WorkIcon sx={{ fontSize: 26, color: '#fff' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={800} lineHeight={1.2}>Recrutador</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Acesse vagas, candidatos e gestão da empresa
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                onClick={() => handleSelectRole('candidate')}
                sx={{
                  cursor: 'pointer',
                  border: '2px solid rgba(34,211,238,0.3)',
                  transition: 'border-color 0.18s, transform 0.18s',
                  '&:hover': { borderColor: '#22D3EE', transform: 'translateY(-1px)' }
                }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{
                      width: 52, height: 52, borderRadius: '50%',
                      display: 'grid', placeItems: 'center', flexShrink: 0,
                      bgcolor: '#0EA5C4'
                    }}>
                      <PersonIcon sx={{ fontSize: 26, color: '#fff' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={800} lineHeight={1.2}>Candidato</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Explore vagas recomendadas pela IA para o seu perfil
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            <Typography textAlign="center" mt={3} color="text.secondary" variant="body2">
              Não tem conta?{' '}
              <Button variant="text" size="small" color="secondary" onClick={() => navigate('/register')} sx={{ fontWeight: 700 }}>
                Criar conta
              </Button>
            </Typography>
          </Box>
        )}

        {/* STEP 2: credentials */}
        {step === 'credentials' && (
          <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleLogin}>
                <Stack spacing={3}>
                  {/* Header with back + role badge */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton size="small" onClick={() => { setStep('role'); setError(null); }}>
                      <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Box
                      sx={{
                        px: 1.5, py: 0.4, borderRadius: 1,
                        border: `1px solid ${role === 'recruiter' ? 'rgba(91,61,245,0.5)' : 'rgba(34,211,238,0.5)'}`,
                        color: role === 'recruiter' ? '#9B8AFB' : '#22D3EE',
                        bgcolor: role === 'recruiter' ? 'rgba(91,61,245,0.1)' : 'rgba(34,211,238,0.1)',
                        fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em',
                        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 0.5
                      }}
                    >
                      {role === 'recruiter'
                        ? <><WorkIcon sx={{ fontSize: 14 }} /> Recrutador</>
                        : <><PersonIcon sx={{ fontSize: 14 }} /> Candidato</>}
                    </Box>
                  </Stack>

                  <Typography variant="h6" fontWeight={800}>
                    Entrar como {role === 'recruiter' ? 'Recrutador' : 'Candidato'}
                  </Typography>

                  {error && <Alert severity="error">{error}</Alert>}

                  <TextField
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                    autoComplete="email"
                  />

                  <TextField
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    fullWidth
                    required
                    autoComplete="current-password"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={loading}
                    sx={{
                      background: role === 'recruiter'
                        ? 'linear-gradient(135deg, #5B3DF5, #4C2FE0)'
                        : 'linear-gradient(135deg, #22D3EE, #0EA5C4)',
                      fontWeight: 800,
                      py: 1.5
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
                  </Button>

                  <Typography textAlign="center" color="text.secondary" variant="body2">
                    Não tem conta de {role === 'recruiter' ? 'recrutador' : 'candidato'}?{' '}
                    <Button variant="text" size="small" color="secondary" onClick={() => navigate('/register')} sx={{ fontWeight: 700 }}>
                      Criar conta
                    </Button>
                  </Typography>
                </Stack>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
    </ThemeProvider>
  );
}
