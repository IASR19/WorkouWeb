import { useState } from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import LockIcon from '@mui/icons-material/Lock';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, IconButton, Stack, TextField, Typography, ThemeProvider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { WorkouLogoMark } from '../../components/WorkouLogo/WorkouLogo';
import { api } from '../../services/api';
import { darkTheme } from '../../theme/theme';

type Role = 'recruiter' | 'candidate';
type Step = 'role' | 'personal' | 'company' | 'plan' | 'payment';

const PLANS = [
  {
    id: 'essencial',
    label: 'Essencial',
    price: 299,
    seats: 1,
    jobs: 3,
    extras: ['1 gestor de RH', '3 vagas/mês', 'CardStack com IA', 'Suporte por e-mail'],
    highlight: false
  },
  {
    id: 'pro',
    label: 'Pro',
    price: 699,
    seats: 3,
    jobs: 10,
    extras: ['3 gestores de RH', '10 vagas/mês', 'CardStack com IA', 'Suporte prioritário', 'Relatórios de match'],
    highlight: true
  },
  {
    id: 'business',
    label: 'Business',
    price: 1499,
    seats: 10,
    jobs: 30,
    extras: ['10 gestores de RH', '30 vagas/mês', 'CardStack com IA', 'Suporte dedicado', 'Dashboard avançado', 'API de integração'],
    highlight: false
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    price: 3999,
    seats: -1,
    jobs: -1,
    extras: ['Gestores ilimitados', 'Vagas ilimitadas', 'CardStack com IA', 'CSM dedicado', 'SLA garantido', 'Integração ATS', 'Treinamento da equipe'],
    highlight: false
  }
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role>('candidate');
  const [selectedPlan, setSelectedPlan] = useState('pro');

  // Personal data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Company data
  const [companyName, setCompanyName] = useState('');
  const [companyCNPJ, setCompanyCNPJ] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  // Payment data (simulated)
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plan = PLANS.find(p => p.id === selectedPlan)!;

  const formatCard = (v: string) => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '');
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}` : digits;
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await api.register(name, email, password, role, role === 'recruiter' ? {
        companyName,
        companyCNPJ: companyCNPJ || undefined,
        companyWebsite: companyWebsite || undefined,
        companyIndustry: companyIndustry || undefined,
        plan: selectedPlan
      } : undefined);

      if (role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate/onboarding');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao criar conta. Tente novamente.');
      setStep('personal');
    } finally {
      setLoading(false);
    }
  };

  const logoArea = (
    <Stack alignItems="center" spacing={1} mb={4}>
      <WorkouLogoMark size={64} />
      <Typography variant="h4" fontWeight={900} letterSpacing="-0.02em">
        <Box component="span" color="white">Work</Box>
        <Box component="span" color="#22D3EE">ou</Box>
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
      <Box width="100%" maxWidth={step === 'plan' ? 860 : 480}>
        {logoArea}

        {/* STEP: ROLE */}
        {step === 'role' && (
          <Box>
            <Typography variant="h5" fontWeight={900} textAlign="center" mb={1}>Criar conta</Typography>
            <Typography color="text.secondary" textAlign="center" mb={4}>Quando a contratação dá certo.</Typography>

            <Stack spacing={2}>
              <Card
                onClick={() => { setRole('recruiter'); setStep('personal'); }}
                sx={{ cursor: 'pointer', border: '2px solid rgba(91,61,245,0.3)', transition: 'border-color 0.2s', '&:hover': { borderColor: '#5B3DF5' } }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#5B3DF5', flexShrink: 0 }}>
                      <BusinessCenterIcon sx={{ fontSize: 30, color: '#fff' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>Sou Recrutador / Empresa</Typography>
                      <Typography variant="body2" color="text.secondary">Cadastre sua empresa, publique vagas e encontre talentos com IA.</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                onClick={() => { setRole('candidate'); setStep('personal'); }}
                sx={{ cursor: 'pointer', border: '2px solid rgba(34,211,238,0.3)', transition: 'border-color 0.2s', '&:hover': { borderColor: '#22D3EE' } }}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ width: 56, height: 56, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#0EA5C4', flexShrink: 0 }}>
                      <PersonSearchIcon sx={{ fontSize: 30, color: '#fff' }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={800}>Sou Candidato</Typography>
                      <Typography variant="body2" color="text.secondary">Envie seu currículo e encontre vagas que combinam com você.</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            <Typography textAlign="center" mt={3} color="text.secondary" variant="body2">
              Já tem conta?{' '}
              <Button variant="text" size="small" color="secondary" onClick={() => navigate('/login')} sx={{ fontWeight: 700 }}>Entrar</Button>
            </Typography>
          </Box>
        )}

        {/* STEP: PERSONAL */}
        {step === 'personal' && (
          <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <IconButton onClick={() => setStep('role')} size="small"><ArrowBackIcon /></IconButton>
                <Typography variant="h6" fontWeight={800}>
                  {role === 'recruiter' ? 'Seus dados de acesso' : 'Criar conta de candidato'}
                </Typography>
              </Stack>

              <Stack spacing={2.5}>
                <TextField label="Nome completo" value={name} onChange={e => setName(e.target.value)} required fullWidth autoFocus />
                <TextField label="E-mail profissional" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
                <TextField label="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} required fullWidth helperText="Mínimo 6 caracteres" />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => {
                    if (!name || !email || password.length < 6) { setError('Preencha todos os campos (mínimo 6 caracteres na senha).'); return; }
                    setError('');
                    if (role === 'recruiter') setStep('company'); else handleSubmit();
                  }}
                  disabled={loading}
                  sx={{ background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)', fontWeight: 800, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : role === 'recruiter' ? 'Continuar →' : 'Criar conta'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* STEP: COMPANY */}
        {step === 'company' && (
          <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                <IconButton onClick={() => setStep('personal')} size="small"><ArrowBackIcon /></IconButton>
                <Typography variant="h6" fontWeight={800}>Dados da empresa</Typography>
              </Stack>

              <Stack spacing={2.5}>
                <TextField label="Nome da empresa *" value={companyName} onChange={e => setCompanyName(e.target.value)} required fullWidth autoFocus />
                <TextField
                  label="CNPJ *"
                  value={companyCNPJ}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 14);
                    const fmt = digits
                      .replace(/^(\d{2})(\d)/, '$1.$2')
                      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                      .replace(/\.(\d{3})(\d)/, '.$1/$2')
                      .replace(/(\d{4})(\d)/, '$1-$2');
                    setCompanyCNPJ(fmt);
                  }}
                  fullWidth
                  required
                  placeholder="00.000.000/0001-00"
                  inputProps={{ maxLength: 18 }}
                  helperText="Obrigatório para cadastro de empresa"
                />
                <TextField label="Setor / Indústria" value={companyIndustry} onChange={e => setCompanyIndustry(e.target.value)} fullWidth placeholder="Ex: Tecnologia, Saúde, Finanças..." />
                <TextField label="Website (opcional)" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} fullWidth placeholder="https://suaempresa.com.br" />

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => {
                    if (!companyName) { setError('Informe o nome da empresa.'); return; }
                    const cnpjDigits = companyCNPJ.replace(/\D/g, '');
                    if (cnpjDigits.length !== 14) { setError('Informe um CNPJ válido com 14 dígitos.'); return; }
                    setError('');
                    setStep('plan');
                  }}
                  sx={{ background: 'linear-gradient(135deg, #5B3DF5, #4C2FE0)', fontWeight: 800, py: 1.5 }}
                >
                  Escolher plano →
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* STEP: PLAN */}
        {step === 'plan' && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <IconButton onClick={() => setStep('company')} size="small" sx={{ color: 'white' }}><ArrowBackIcon /></IconButton>
              <Box>
                <Typography variant="h5" fontWeight={900} color="white">Escolha seu plano</Typography>
                <Typography color="text.secondary" variant="body2">Comece grátis por 14 dias, sem cartão de crédito.</Typography>
              </Box>
            </Stack>

            <Grid container spacing={2} mb={3}>
              {PLANS.map(p => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card
                    onClick={() => setSelectedPlan(p.id)}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      border: selectedPlan === p.id
                        ? '2px solid #5B3DF5'
                        : p.highlight ? '2px solid rgba(34,211,238,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      transition: 'border-color 0.2s',
                      position: 'relative',
                      '&:hover': { borderColor: '#5B3DF5' }
                    }}
                  >
                    {p.highlight && (
                      <Chip
                        icon={<StarIcon sx={{ fontSize: '12px !important' }} />}
                        label="Mais popular"
                        size="small"
                        sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(34,211,238,0.15)', color: '#22D3EE', fontSize: '0.65rem', fontWeight: 800 }}
                      />
                    )}
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="subtitle1" fontWeight={800} mb={0.5}>{p.label}</Typography>
                      <Typography variant="h5" fontWeight={900} color={p.highlight ? '#22D3EE' : 'white'} mb={0.5}>
                        R$ {p.price.toLocaleString('pt-BR')}
                        <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>/mês</Typography>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={1.5} fontSize="0.75rem">
                        {p.seats === -1 ? 'Seats ilimitados' : `${p.seats} seat${p.seats > 1 ? 's' : ''}`} · {p.jobs === -1 ? 'Vagas ilimitadas' : `${p.jobs} vagas/mês`}
                      </Typography>
                      <Divider sx={{ mb: 1.5 }} />
                      <Stack spacing={0.5}>
                        {p.extras.map(feat => (
                          <Stack key={feat} direction="row" spacing={0.5} alignItems="center">
                            <CheckIcon sx={{ fontSize: 14, color: '#22D3EE' }} />
                            <Typography variant="body2" fontSize="0.75rem" color="text.secondary">{feat}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography fontWeight={800}>Plano selecionado: {plan.label}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {plan.seats === -1 ? 'Ilimitado' : `${plan.seats} seat${plan.seats > 1 ? 's'  : ''}`} · {plan.jobs === -1 ? 'Vagas ilimitadas' : `${plan.jobs} vagas/mês`} · R$ {plan.price}/mês
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => setStep('payment')}
                    sx={{ background: 'linear-gradient(135deg, #5B3DF5, #4C2FE0)', fontWeight: 800, px: 3 }}
                  >
                    Ir para pagamento →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* STEP: PAYMENT */}
        {step === 'payment' && (
          <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <IconButton onClick={() => setStep('plan')} size="small"><ArrowBackIcon /></IconButton>
                <Typography variant="h6" fontWeight={800}>Pagamento simulado</Typography>
              </Stack>
              <Alert severity="info" sx={{ mb: 3, fontSize: '0.8rem' }}>
                Este é um ambiente de testes. Qualquer cartão é aceito — o pagamento é sempre aprovado.
              </Alert>

              <Stack spacing={2.5}>
                <Box sx={{ p: 2, border: '1px solid rgba(91,61,245,0.2)', borderRadius: 2, background: 'rgba(91,61,245,0.05)' }}>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>Resumo do pedido</Typography>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={700}>Workou {plan.label} — Mensal</Typography>
                    <Typography fontWeight={900} color="#22D3EE">R$ {plan.price.toLocaleString('pt-BR')}</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Empresa: {companyName} · {plan.seats === -1 ? 'Ilimitado' : `${plan.seats} seat${plan.seats > 1 ? 's' : ''}`} · {plan.jobs === -1 ? 'Vagas ilimitadas' : `${plan.jobs} vagas/mês`}
                  </Typography>
                </Box>

                <TextField
                  label="Número do cartão"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCard(e.target.value))}
                  fullWidth
                  placeholder="0000 0000 0000 0000"
                  inputProps={{ maxLength: 19 }}
                  autoFocus
                />
                <TextField
                  label="Nome no cartão"
                  value={cardName}
                  onChange={e => setCardName(e.target.value.toUpperCase())}
                  fullWidth
                  placeholder="NOME SOBRENOME"
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Validade"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/AA"
                    inputProps={{ maxLength: 5 }}
                    fullWidth
                  />
                  <TextField
                    label="CVV"
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="000"
                    inputProps={{ maxLength: 4 }}
                    fullWidth
                  />
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  onClick={() => {
                    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                      setError('Preencha os dados do cartão para continuar.');
                      return;
                    }
                    setError('');
                    handleSubmit();
                  }}
                  sx={{ background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)', fontWeight: 800, py: 1.5, fontSize: '1rem' }}
                >
                  {loading
                    ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> Processando...</>
                    : `Pagar R$ ${plan.price.toLocaleString('pt-BR')} e criar conta`}
                </Button>

                <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                  <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" textAlign="center">
                    Pagamento 100% seguro e criptografado (simulação)
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
    </ThemeProvider>
  );
}
