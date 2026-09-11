import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Stack,
  ThemeProvider,
  Typography
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import ForumIcon from '@mui/icons-material/Forum';
import TuneIcon from '@mui/icons-material/Tune';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PersonIcon from '@mui/icons-material/Person';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

import { WorkouLogoMark } from '../../components/WorkouLogo/WorkouLogo';
import { darkTheme } from '../../theme/theme';
import { api } from '../../services/api';
import { Reveal } from './Reveal';
import { useReveal } from './useReveal';

// Fonte de display só para esta página — não sobrescreve o tema global (ver theme.ts).
const displayFontFamily = ['"Space Grotesk"', 'Inter', 'Roboto', 'Arial', 'sans-serif'].join(',');

// "/" always renders the LP itself — it never auto-redirects on load. Only when the
// visitor actively tries to log in or sign up do we check for a still-valid session
// and skip straight to the dashboard; a missing/expired token falls through to the
// normal login/register flow.
function goAuth(navigate: ReturnType<typeof useNavigate>, fallback: 'login' | 'register') {
  const currentUser = api.getCurrentUser();
  if (api.hasValidSession() && currentUser) {
    navigate(currentUser.role === 'recruiter' ? '/recruiter' : '/candidate');
    return;
  }
  navigate(`/${fallback}`);
}

const NAV_LINKS = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Preços', href: '#precos' }
];

const STEPS_RECRUTADOR = [
  { title: 'Publique a vaga', text: 'Descreva o cargo, skills e modelo de trabalho em poucos campos objetivos.' },
  { title: 'Deslize os perfis', text: 'A IA lê currículos e ordena candidatos por aderência real à vaga, não por palavras-chave soltas.' },
  { title: 'Converse com quem interessa', text: 'Deu match, abre o chat na hora. Sem planilha, sem e-mail perdido no meio de 200 outros.' }
];

const STEPS_CANDIDATO = [
  { title: 'Suba seu currículo', text: 'A IA extrai skills, experiência e pretensão automaticamente, do PDF que você já tem.' },
  { title: 'Veja vagas com score', text: 'Cada vaga chega com um percentual de compatibilidade calculado, não um feed genérico.' },
  { title: 'Combine e negocie direto', text: 'Recrutador curtiu de volta, o chat abre e a conversa começa sem intermediário.' }
];

const MATCH_CRITERIA = [
  { label: 'Skills técnicas', value: 92, color: '#5B3DF5' },
  { label: 'Senioridade', value: 88, color: '#8B7CF6' },
  { label: 'Modelo de trabalho', value: 100, color: '#22D3EE' },
  { label: 'Faixa salarial', value: 76, color: '#0EA5C4' }
];

function MatchScoreWidget() {
  const { ref, visible } = useReveal(0.35);
  return (
    <Box ref={ref} sx={{ mt: 3.5 }}>
      <Stack spacing={2}>
        {MATCH_CRITERIA.map((c, i) => (
          <Box key={c.label}>
            <Stack direction="row" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="rgba(255,255,255,0.6)" fontWeight={700}>
                {c.label}
              </Typography>
              <Typography variant="caption" fontWeight={800} sx={{ color: c.color }}>
                {c.value}%
              </Typography>
            </Stack>
            <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <Box
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  bgcolor: c.color,
                  width: visible ? `${c.value}%` : '0%',
                  transition: `width 0.9s cubic-bezier(.2,.7,.2,1) ${i * 130}ms`
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        mt={2.75}
        sx={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.65s' }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22D3EE', animation: 'workou-pulse 2s infinite' }} />
        <Typography variant="caption" fontWeight={800} color="#22D3EE">
          Score final: 89% de compatibilidade
        </Typography>
      </Stack>
    </Box>
  );
}

const PARSED_CHIPS = ['React', 'TypeScript', '4 anos exp.', 'Remoto'];

function ParseWidget() {
  const { ref, visible } = useReveal(0.35);
  return (
    <Box
      ref={ref}
      sx={{ mt: 2.5, p: 1.75, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
        <InsertDriveFileOutlinedIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
        <Typography variant="caption" color="rgba(255,255,255,0.5)" fontFamily="monospace">
          curriculo_ana.pdf
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        {PARSED_CHIPS.map((c, i) => (
          <Chip
            key={c}
            label={c}
            size="small"
            sx={{
              bgcolor: 'rgba(34,211,238,0.12)',
              color: '#22D3EE',
              fontSize: '0.68rem',
              fontWeight: 700,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity 0.4s ${300 + i * 140}ms, transform 0.4s ${300 + i * 140}ms`
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

function ChatWidget() {
  const { ref, visible } = useReveal(0.35);
  return (
    <Box
      ref={ref}
      sx={{ mt: 2.5, p: 1.75, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Stack spacing={1}>
        <Box
          sx={{
            alignSelf: 'flex-start',
            maxWidth: '82%',
            px: 1.5,
            py: 0.85,
            borderRadius: '12px 12px 12px 2px',
            bgcolor: 'rgba(255,255,255,0.08)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.4s 0.2s, transform 0.4s 0.2s'
          }}
        >
          <Typography variant="caption" color="#fff">Oi! Vi que deu match, bora conversar? 👋</Typography>
        </Box>
        <Box
          sx={{
            alignSelf: 'flex-end',
            maxWidth: '82%',
            px: 1.5,
            py: 0.85,
            borderRadius: '12px 12px 2px 12px',
            background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.4s 0.7s, transform 0.4s 0.7s'
          }}
        >
          <Typography variant="caption" color="#fff" fontWeight={700}>Bora! Fico livre às 15h.</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function SyncWidget() {
  const [state, setState] = useState<'idle' | 'syncing' | 'done'>('idle');

  const handleClick = () => {
    if (state !== 'idle') return;
    setState('syncing');
    setTimeout(() => setState('done'), 1100);
    setTimeout(() => setState('idle'), 3400);
  };

  return (
    <Box sx={{ mt: 2.5 }}>
      <Button
        size="small"
        onClick={handleClick}
        disabled={state !== 'idle'}
        sx={{
          borderRadius: 5,
          px: 2,
          fontWeight: 800,
          fontSize: '0.72rem',
          color: '#0EA5C4',
          bgcolor: 'rgba(34,211,238,0.1)',
          '&:hover': { bgcolor: 'rgba(34,211,238,0.18)' }
        }}
      >
        Simular edição da vaga
      </Button>
      <Stack direction="row" alignItems="center" spacing={1} mt={1.5} sx={{ minHeight: 22 }}>
        {state === 'syncing' && (
          <>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#22D3EE', animation: 'workou-pulse 0.8s infinite' }} />
            <Typography variant="caption" color="rgba(255,255,255,0.6)">Recalculando compatibilidade...</Typography>
          </>
        )}
        {state === 'done' && (
          <>
            <CheckIcon sx={{ fontSize: 16, color: '#10d99b' }} />
            <Typography variant="caption" fontWeight={700} color="#10d99b">
              3 candidatos reavaliados, 0 duplicados
            </Typography>
          </>
        )}
      </Stack>
    </Box>
  );
}

const FEATURES = [
  {
    icon: <TuneIcon />,
    title: 'Match por critério, não por sorte',
    text: 'Skills, senioridade, modelo de trabalho e faixa salarial entram no cálculo de compatibilidade de cada vaga.',
    widget: <MatchScoreWidget />
  },
  {
    icon: <BoltIcon />,
    title: 'Currículo lido por IA em segundos',
    text: 'Nada de preencher formulário repetido. O PDF vira perfil estruturado sozinho.',
    widget: <ParseWidget />
  },
  {
    icon: <ForumIcon />,
    title: 'Chat só depois do match',
    text: 'Conversa nasce de interesse mútuo confirmado — sem spam de recrutador nem currículo ignorado.',
    widget: <ChatWidget />
  },
  {
    icon: <ShieldOutlinedIcon />,
    title: 'Vagas sempre atualizadas',
    text: 'Editou a vaga, o recálculo de compatibilidade roda de novo — sem duplicar quem já foi avaliado.',
    widget: <SyncWidget />
  }
];

type Plan = {
  id: string;
  label: string;
  price: number | null; // null = "fale com vendas", sem preço fixo publicado
  jobs: number;
  extraJob: number;
  highlight: boolean;
  color: string;
};

// Seats são ilimitados em todos os planos — cobrar por login de RH desincentivava o time
// inteiro de usar a ferramenta. O único eixo de cobrança é o volume de vagas publicadas.
const PLANS: Plan[] = [
  { id: 'essencial', label: 'Essencial', price: 299, jobs: 3, extraJob: 49, highlight: false, color: '#8B7CF6' },
  { id: 'pro', label: 'Pro', price: 699, jobs: 10, extraJob: 39, highlight: true, color: '#22D3EE' },
  { id: 'business', label: 'Business', price: 1499, jobs: 30, extraJob: 29, highlight: false, color: '#FFC94D' },
  { id: 'enterprise', label: 'Enterprise', price: null, jobs: -1, extraJob: 0, highlight: false, color: '#FF7A8A' }
];

function useCountUp(target: number, duration = 550) {
  const [value, setValue] = useState(0);
  // Mirrors the currently rendered value (not just the last completed target), so an
  // interrupted animation (e.g. rapid +/- clicks) resumes from what's on screen instead
  // of snapping back to the last value that finished animating.
  const valueRef = useRef(0);

  useEffect(() => {
    const from = valueRef.current;
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(from + (target - from) * eased);
      valueRef.current = next;
      setValue(next);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function IconStack({ icon, count, color }: { icon: ReactNode; count: number; color: string }) {
  const { ref, visible } = useReveal(0.4);
  const unlimited = count === -1;
  const shown = unlimited ? 5 : Math.min(count, 5);
  const overflow = unlimited ? 0 : Math.max(0, count - 5);

  return (
    <Stack ref={ref} direction="row" spacing={-0.75} alignItems="center">
      {Array.from({ length: shown }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: `${color}26`,
            border: `1.5px solid ${color}`,
            color,
            boxShadow: '0 0 0 3px #0B1220',
            transform: visible ? 'scale(1)' : 'scale(0)',
            transition: `transform 0.35s cubic-bezier(.34,1.56,.64,1) ${i * 90}ms`,
            '& svg': { fontSize: 14 }
          }}
        >
          {unlimited && i === shown - 1 ? <AllInclusiveIcon sx={{ fontSize: '14px !important' }} /> : icon}
        </Box>
      ))}
      {overflow > 0 && (
        <Box
          sx={{
            ml: 1.2,
            fontSize: '0.68rem',
            fontWeight: 800,
            color,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.3s ${shown * 90}ms`
          }}
        >
          +{overflow}
        </Box>
      )}
    </Stack>
  );
}

function PlanCard({ plan, delay }: { plan: Plan; delay: number }) {
  const navigate = useNavigate();
  const [extraJobs, setExtraJobs] = useState(0);
  const isCustom = plan.price === null;
  const unlimitedJobs = plan.jobs === -1;

  const total = (plan.price ?? 0) + extraJobs * plan.extraJob;
  const displayTotal = useCountUp(total);

  const handleCta = () => {
    if (isCustom) {
      window.location.href = 'mailto:contato@workou.com.br?subject=Interesse%20no%20plano%20Enterprise';
      return;
    }
    goAuth(navigate, 'register');
  };

  return (
    <Reveal delay={delay}>
      <Box
        sx={{
          height: '100%',
          p: 3,
          borderRadius: 3,
          position: 'relative',
          border: plan.highlight ? `1.5px solid ${plan.color}` : '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(255,255,255,0.02)',
          boxShadow: plan.highlight ? `0 0 0 1px ${plan.color}22, 0 20px 40px ${plan.color}1a` : 'none',
          transition: 'transform 0.25s, box-shadow 0.25s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 44px ${plan.color}22`
          }
        }}
      >
        {plan.highlight && (
          <Chip
            label="Mais escolhido"
            size="small"
            sx={{
              position: 'absolute',
              top: -12,
              left: 20,
              bgcolor: plan.color,
              color: '#0B1220',
              fontWeight: 900,
              fontSize: '0.65rem'
            }}
          />
        )}
        <Typography fontWeight={800} mb={0.5}>{plan.label}</Typography>

        {isCustom ? (
          <Box mb={2}>
            <Typography variant="h5" fontWeight={800} sx={{ color: plan.color }}>Sob consulta</Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)">Preço negociado com o time comercial</Typography>
          </Box>
        ) : (
          <Stack direction="row" alignItems="baseline" spacing={0.5} mb={2}>
            <Typography variant="h4" fontWeight={800} sx={{ color: plan.color, fontVariantNumeric: 'tabular-nums' }}>
              R$ {displayTotal.toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.5)">/mês</Typography>
          </Stack>
        )}

        <Stack spacing={1.5} mb={2.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="caption" fontWeight={800} color="rgba(255,255,255,0.75)" display="block">
                Seats ilimitados
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.45)">Todo o seu time de RH, sem custo por login</Typography>
            </Box>
            <IconStack icon={<PersonIcon sx={{ fontSize: '14px !important' }} />} count={-1} color={plan.color} />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="caption" fontWeight={800} color="rgba(255,255,255,0.75)" display="block">
                {unlimitedJobs ? 'Vagas ilimitadas' : `${plan.jobs} vagas/mês`}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.45)">1 vaga = 1 posição publicada</Typography>
            </Box>
            <IconStack icon={<BusinessCenterIcon sx={{ fontSize: '13px !important' }} />} count={plan.jobs} color={plan.color} />
          </Stack>
          {!unlimitedJobs && !isCustom && plan.extraJob > 0 && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" pl={0.25}>
              <Typography variant="caption" color="rgba(255,255,255,0.4)">+R$ {plan.extraJob}/vaga extra</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton size="small" onClick={() => setExtraJobs((v) => Math.max(0, v - 1))} sx={{ color: 'rgba(255,255,255,0.5)', p: 0.25 }}>
                  <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography variant="caption" fontWeight={800} minWidth={12} textAlign="center">{extraJobs}</Typography>
                <IconButton size="small" onClick={() => setExtraJobs((v) => v + 1)} sx={{ color: plan.color, p: 0.25 }}>
                  <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="flex-start" mb={3}>
          <CheckIcon sx={{ fontSize: 16, color: plan.color, mt: '2px' }} />
          <Typography variant="body2" color="rgba(255,255,255,0.55)" fontSize="0.82rem">
            Match por IA, CardStack e chat inclusos em todos os planos
          </Typography>
        </Stack>

        <Button
          fullWidth
          onClick={handleCta}
          variant={plan.highlight ? 'contained' : 'outlined'}
          sx={{
            fontWeight: 800,
            borderRadius: 2,
            ...(plan.highlight
              ? { background: `linear-gradient(135deg, ${plan.color}, #5B3DF5)`, color: '#0B1220' }
              : { borderColor: 'rgba(255,255,255,0.2)', color: '#fff' })
          }}
        >
          {isCustom ? 'Falar com vendas' : `Assinar ${plan.label}`}
        </Button>
      </Box>
    </Reveal>
  );
}

type StackItem = { name: string; role: string; match: number; skills: string[] };

const RECRUITER_STACK: StackItem[] = [
  { name: 'Ana Souza', role: 'Dev Frontend Pleno · Remoto', match: 92, skills: ['React', 'TypeScript', 'Node'] },
  { name: 'Bruno Lima', role: 'Dev Backend Sênior · Híbrido', match: 87, skills: ['Python', 'Django', 'AWS'] },
  { name: 'Carla Dias', role: 'UX Designer · Remoto', match: 95, skills: ['Figma', 'Design System', 'UX Research'] }
];

const CANDIDATE_STACK: StackItem[] = [
  { name: 'Tech Lead Frontend', role: 'RemoteCo · Remoto', match: 92, skills: ['React', 'Liderança', 'TypeScript'] },
  { name: 'Analista de Dados Pleno', role: 'DataCorp · Híbrido', match: 88, skills: ['SQL', 'Python', 'Power BI'] },
  { name: 'Product Designer', role: 'Nuvem Labs · Remoto', match: 90, skills: ['Figma', 'Research', 'Prototipagem'] }
];

function InteractiveMatchCard() {
  const [side, setSide] = useState<'recruiter' | 'candidate'>('recruiter');
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState<'left' | 'right' | null>(null);

  const stack = side === 'recruiter' ? RECRUITER_STACK : CANDIDATE_STACK;
  const current = stack[index % stack.length];
  const accent = side === 'recruiter' ? '#9B8AFB' : '#22D3EE';

  const handleSwipe = (direction: 'left' | 'right') => {
    if (exit) return;
    setExit(direction);
    setTimeout(() => {
      setIndex((i) => (i + 1) % stack.length);
      setExit(null);
    }, 280);
  };

  const handleSide = (next: 'recruiter' | 'candidate') => {
    if (next === side || exit) return;
    setSide(next);
    setIndex(0);
  };

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Stack direction="row" spacing={1} justifyContent="center" mb={4}>
        {(
          [
            { key: 'recruiter' as const, label: 'Lado do recrutador', color: '#9B8AFB' },
            { key: 'candidate' as const, label: 'Lado do candidato', color: '#22D3EE' }
          ]
        ).map((opt) => (
          <Button
            key={opt.key}
            size="small"
            onClick={() => handleSide(opt.key)}
            sx={{
              borderRadius: 5,
              px: 2,
              py: 0.6,
              fontWeight: 800,
              fontSize: '0.76rem',
              transition: 'background-color 0.2s, color 0.2s',
              color: side === opt.key ? '#0B1220' : 'rgba(255,255,255,0.6)',
              bgcolor: side === opt.key ? opt.color : 'rgba(255,255,255,0.06)',
              '&:hover': { bgcolor: side === opt.key ? opt.color : 'rgba(255,255,255,0.1)' }
            }}
          >
            {opt.label}
          </Button>
        ))}
      </Stack>

      <Box sx={{ position: 'relative', width: { xs: 220, sm: 260 }, height: { xs: 300, sm: 340 }, mx: 'auto' }}>
        {[
          { rotate: 8, translate: 14, opacity: 0.35, z: 1 },
          { rotate: -6, translate: 8, opacity: 0.6, z: 2 }
        ].map((c, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(160deg, rgba(91,61,245,0.18), rgba(13,28,51,0.6))',
              transform: `rotate(${c.rotate}deg) translateY(${c.translate}px)`,
              opacity: c.opacity,
              zIndex: c.z
            }}
          />
        ))}
        <Box
          key={`${side}-${index}`}
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 4,
            zIndex: 3,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.14)',
            background: 'linear-gradient(165deg, #16233F 0%, #0B1220 78%)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            transition: 'transform 0.28s cubic-bezier(.2,.7,.2,1), opacity 0.28s',
            transform:
              exit === 'left'
                ? 'translateX(-180px) rotate(-16deg)'
                : exit === 'right'
                  ? 'translateX(180px) rotate(16deg)'
                  : 'translateX(0) rotate(0deg)',
            opacity: exit ? 0 : 1,
            animation: exit ? 'none' : 'workou-float 4.5s ease-in-out infinite'
          }}
        >
          <Box
            sx={{
              height: '58%',
              background: side === 'recruiter' ? 'linear-gradient(135deg, #5B3DF5, #22D3EE)' : 'linear-gradient(135deg, #22D3EE, #5B3DF5)',
              opacity: 0.85
            }}
          />
          <Box sx={{ p: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography fontWeight={800} fontSize="0.95rem" color="#fff">{current.name}</Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.6)">{current.role}</Typography>
              </Box>
              <Chip
                label={`${current.match}% match`}
                size="small"
                sx={{ bgcolor: `${accent}29`, color: accent, fontWeight: 900, fontSize: '0.68rem' }}
              />
            </Stack>
            <Stack direction="row" spacing={0.75} mt={1.5} flexWrap="wrap" useFlexGap>
              {current.skills.map((s) => (
                <Chip
                  key={s}
                  label={s}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem' }}
                />
              ))}
            </Stack>
          </Box>
        </Box>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ position: 'absolute', bottom: -24, left: 0, right: 0, zIndex: 4 }}
        >
          <Box
            component="button"
            aria-label="Recusar"
            onClick={() => handleSwipe('left')}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#141E33',
              border: '1px solid rgba(255,90,110,0.4)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              transition: 'transform 0.15s, border-color 0.15s',
              '&:hover': { transform: 'scale(1.08)', borderColor: '#ff5d73' },
              '&:active': { transform: 'scale(0.94)' }
            }}
          >
            <CloseIcon sx={{ color: '#ff5d73', fontSize: 20 }} />
          </Box>
          <Box
            component="button"
            aria-label="Dar match"
            onClick={() => handleSwipe('right')}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: '#141E33',
              border: '1px solid rgba(34,211,238,0.4)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              transition: 'transform 0.15s, border-color 0.15s',
              '&:hover': { transform: 'scale(1.08)', borderColor: '#22D3EE' },
              '&:active': { transform: 'scale(0.94)' }
            }}
          >
            <FavoriteIcon sx={{ color: '#22D3EE', fontSize: 20 }} />
          </Box>
        </Stack>
      </Box>

      <Typography variant="caption" color="rgba(255,255,255,0.4)" display="block" mt={5}>
        Toque nos botões pra simular um swipe de verdade.
      </Typography>
    </Box>
  );
}

function StepsColumn({ heading, accent, steps }: { heading: string; accent: string; steps: { title: string; text: string }[] }) {
  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography
        variant="overline"
        sx={{ color: accent, fontWeight: 800, letterSpacing: '0.08em' }}
      >
        {heading}
      </Typography>
      <Stack spacing={3} mt={2}>
        {steps.map((s, i) => (
          <Stack key={s.title} direction="row" spacing={2}>
            <Box
              sx={{
                flexShrink: 0,
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: '0.85rem',
                color: '#0B1220',
                bgcolor: accent
              }}
            >
              {i + 1}
            </Box>
            <Box>
              <Typography fontWeight={800} mb={0.25}>{s.title}</Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)">{s.text}</Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          bgcolor: '#0B1220',
          color: '#fff',
          minHeight: '100vh',
          overflowX: 'hidden',
          '@keyframes workou-float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' }
          },
          '@keyframes workou-pulse': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 0.9 }
          }
        }}
      >
        {/* NAV */}
        <Box
          component="header"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1200,
            transition: 'background 0.25s, border-color 0.25s, backdrop-filter 0.25s',
            bgcolor: scrolled ? 'rgba(11,18,32,0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(14px)' : 'none',
            borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" alignItems="center" justifyContent="space-between" py={1.75}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <WorkouLogoMark size={30} />
                <Typography fontWeight={900} fontSize="1.05rem" letterSpacing="-0.02em">
                  Work<Box component="span" color="#22D3EE">ou</Box>
                </Typography>
              </Stack>

              <Stack direction="row" spacing={3} alignItems="center" sx={{ display: { xs: 'none', md: 'flex' } }}>
                {NAV_LINKS.map((l) => (
                  <Typography
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.72)',
                      '&:hover': { color: '#fff' }
                    }}
                  >
                    {l.label}
                  </Typography>
                ))}
              </Stack>

              <Stack direction="row" spacing={1.25} alignItems="center">
                <Button
                  onClick={() => goAuth(navigate, 'login')}
                  sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Entrar
                </Button>
                <Button
                  onClick={() => goAuth(navigate, 'register')}
                  variant="contained"
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2,
                    px: 2.5,
                    background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)'
                  }}
                >
                  Criar conta
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* HERO */}
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 16, md: 20 },
            pb: { xs: 10, md: 14 },
            background:
              'radial-gradient(circle at 14% 8%, rgba(91,61,245,0.28), transparent 40%), radial-gradient(circle at 88% 22%, rgba(34,211,238,0.20), transparent 36%)'
          }}
        >
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 8, md: 4 }} alignItems="center">
              <Box flex={1}>
                <Reveal>
                  <Chip
                    label="Recrutamento com match de verdade"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(91,61,245,0.15)',
                      color: '#B9AAFF',
                      fontWeight: 800,
                      letterSpacing: '0.03em',
                      mb: 3
                    }}
                  />
                </Reveal>
                <Reveal delay={80}>
                  <Typography
                    variant="h1"
                    sx={{ fontFamily: displayFontFamily, fontSize: { xs: '2.3rem', sm: '2.9rem', md: '3.4rem' }, lineHeight: 1.08, mb: 3 }}
                  >
                    Contratar não devia parecer{' '}
                    <Box component="span" sx={{ color: '#22D3EE' }}>garimpo de currículo</Box>.
                  </Typography>
                </Reveal>
                <Reveal delay={160}>
                  <Typography
                    variant="h6"
                    fontWeight={400}
                    sx={{ color: 'rgba(255,255,255,0.68)', maxWidth: 480, mb: 4, lineHeight: 1.5 }}
                  >
                    O Workou lê o currículo, calcula a aderência real à vaga e só abre o chat
                    quando o interesse é dos dois lados. Menos triagem manual, mais conversa que leva a algo.
                  </Typography>
                </Reveal>
                <Reveal delay={240}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                      onClick={() => goAuth(navigate, 'register')}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3.5,
                        py: 1.4,
                        background: 'linear-gradient(135deg, #5B3DF5, #4C2FE0)',
                        boxShadow: '0 12px 30px rgba(91,61,245,0.35)'
                      }}
                    >
                      Quero contratar
                    </Button>
                    <Button
                      onClick={() => goAuth(navigate, 'register')}
                      variant="outlined"
                      size="large"
                      sx={{
                        fontWeight: 800,
                        borderRadius: 2,
                        px: 3.5,
                        py: 1.4,
                        borderColor: 'rgba(34,211,238,0.5)',
                        color: '#22D3EE',
                        '&:hover': { borderColor: '#22D3EE', bgcolor: 'rgba(34,211,238,0.08)' }
                      }}
                    >
                      Quero uma vaga
                    </Button>
                  </Stack>
                </Reveal>
              </Box>

              <Box flex={1} display="flex" justifyContent="center">
                <Reveal delay={200} y={0}>
                  <InteractiveMatchCard />
                </Reveal>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* COMO FUNCIONA */}
        <Box id="como-funciona" sx={{ py: { xs: 9, md: 12 }, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Container maxWidth="lg">
            <Reveal>
              <Typography variant="h2" sx={{ fontFamily: displayFontFamily, fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1 }}>
                Dois lados, um match
              </Typography>
              <Typography color="rgba(255,255,255,0.6)" mb={6} maxWidth={560}>
                O mesmo motor de compatibilidade trabalha para quem contrata e para quem busca a próxima vaga.
              </Typography>
            </Reveal>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 6, md: 8 }}>
              <Reveal delay={80} sx={{ flex: 1 }}>
                <StepsColumn heading="Para recrutadores" accent="#9B8AFB" steps={STEPS_RECRUTADOR} />
              </Reveal>
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.08)', display: { xs: 'none', md: 'block' } }} />
              <Reveal delay={160} sx={{ flex: 1 }}>
                <StepsColumn heading="Para candidatos" accent="#22D3EE" steps={STEPS_CANDIDATO} />
              </Reveal>
            </Stack>
          </Container>
        </Box>

        {/* RECURSOS — bento assimétrico, não grid 3x uniforme */}
        <Box id="recursos" sx={{ py: { xs: 9, md: 12 }, bgcolor: '#0D1526', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Container maxWidth="lg">
            <Reveal>
              <Typography variant="h2" sx={{ fontFamily: displayFontFamily, fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1 }}>
                Feito pra reduzir ruído, não pra empilhar feature
              </Typography>
              <Typography color="rgba(255,255,255,0.6)" mb={6} maxWidth={560}>
                Cada recurso existe pra resolver uma fricção específica do processo seletivo.
              </Typography>
            </Reveal>
            <Box
              sx={{
                display: 'grid',
                gap: 2.5,
                gridTemplateColumns: { xs: '1fr', md: '1.3fr 1fr' }
              }}
            >
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 90} sx={i === 0 ? { gridRow: { md: 'span 2' } } : undefined}>
                  <Box
                    sx={{
                      height: '100%',
                      p: i === 0 ? 4 : 3,
                      borderRadius: 3,
                      border: '1px solid rgba(255,255,255,0.08)',
                      bgcolor: i % 2 === 0 ? 'rgba(91,61,245,0.07)' : 'rgba(34,211,238,0.05)',
                      transition: 'border-color 0.2s, transform 0.2s',
                      '&:hover': {
                        borderColor: i % 2 === 0 ? 'rgba(91,61,245,0.4)' : 'rgba(34,211,238,0.4)',
                        transform: 'translateY(-3px)'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        display: 'grid',
                        placeItems: 'center',
                        mb: 2,
                        bgcolor: i % 2 === 0 ? '#5B3DF5' : '#0EA5C4',
                        color: '#fff'
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography fontWeight={800} fontSize={i === 0 ? '1.2rem' : '1.05rem'} mb={1}>
                      {f.title}
                    </Typography>
                    <Typography color="rgba(255,255,255,0.62)" fontSize="0.92rem">
                      {f.text}
                    </Typography>
                    {f.widget}
                  </Box>
                </Reveal>
              ))}
            </Box>
          </Container>
        </Box>

        {/* PRECOS */}
        <Box id="precos" sx={{ py: { xs: 9, md: 12 } }}>
          <Container maxWidth="lg">
            <Reveal>
              <Typography variant="h2" sx={{ fontFamily: displayFontFamily, fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 1 }}>
                Preço por empresa, não por candidato
              </Typography>
              <Typography color="rgba(255,255,255,0.6)" mb={6} maxWidth={560}>
                Candidatos usam o Workou de graça, sempre. Empresas pagam só pelo volume de vagas — o tamanho do time de RH nunca é fator de custo.
              </Typography>
            </Reveal>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={5}>
              <Reveal sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(155,138,251,0.25)', bgcolor: 'rgba(91,61,245,0.06)', height: '100%' }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'rgba(155,138,251,0.18)',
                      color: '#9B8AFB'
                    }}
                  >
                    <PersonIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={800} fontSize="0.92rem" mb={0.25}>O que é um seat?</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" fontSize="0.82rem">
                      Cada seat é 1 login de gestor de RH. Em todos os planos, seats são ilimitados — chame o time inteiro sem pagar por login.
                    </Typography>
                  </Box>
                </Stack>
              </Reveal>
              <Reveal delay={100} sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ p: 2.5, borderRadius: 3, border: '1px solid rgba(34,211,238,0.25)', bgcolor: 'rgba(34,211,238,0.05)', height: '100%' }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'rgba(34,211,238,0.16)',
                      color: '#22D3EE'
                    }}
                  >
                    <BusinessCenterIcon />
                  </Box>
                  <Box>
                    <Typography fontWeight={800} fontSize="0.92rem" mb={0.25}>O que é uma vaga?</Typography>
                    <Typography variant="body2" color="rgba(255,255,255,0.6)" fontSize="0.82rem">
                      Cada vaga é 1 posição publicada por mês, com o motor de match rodando nela até você fechar a contratação.
                    </Typography>
                  </Box>
                </Stack>
              </Reveal>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }
              }}
            >
              {PLANS.map((plan, i) => (
                <PlanCard key={plan.id} plan={plan} delay={i * 80} />
              ))}
            </Box>
            <Reveal delay={320}>
              <Typography textAlign="center" color="rgba(255,255,255,0.45)" variant="body2" mt={4}>
                Use os controles + / − em cada plano pra ver o preço mudar com vagas extras. 14 dias grátis em qualquer plano.
              </Typography>
            </Reveal>
          </Container>
        </Box>

        {/* CTA FINAL */}
        <Box sx={{ py: { xs: 8, md: 10 } }}>
          <Container maxWidth="md">
            <Reveal>
              <Box
                sx={{
                  textAlign: 'center',
                  p: { xs: 4, md: 7 },
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'linear-gradient(135deg, rgba(91,61,245,0.18), rgba(34,211,238,0.12))',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#22D3EE',
                    top: 24,
                    right: 32,
                    animation: 'workou-pulse 2.2s ease-in-out infinite'
                  }}
                />
                <Typography variant="h3" sx={{ fontFamily: displayFontFamily, fontSize: { xs: '1.6rem', md: '2rem' }, mb: 1.5 }}>
                  Deu match. Deu certo.
                </Typography>
                <Typography color="rgba(255,255,255,0.65)" mb={4} maxWidth={420} mx="auto">
                  Crie sua conta agora e veja os primeiros matches em minutos, não em semanas.
                </Typography>
                <Button
                  onClick={() => goAuth(navigate, 'register')}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    fontWeight: 800,
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)'
                  }}
                >
                  Criar conta grátis
                </Button>
              </Box>
            </Reveal>
          </Container>
        </Box>

        {/* FOOTER */}
        <Box component="footer" sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <WorkouLogoMark size={22} />
                <Typography fontWeight={800} fontSize="0.9rem">
                  Work<Box component="span" color="#22D3EE">ou</Box>
                </Typography>
              </Stack>
              <Typography variant="body2" color="rgba(255,255,255,0.4)">
                © {new Date().getFullYear()} Workou. Todos os direitos reservados.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
