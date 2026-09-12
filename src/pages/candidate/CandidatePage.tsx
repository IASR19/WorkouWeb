import { useState, useEffect, useMemo } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StarIcon from '@mui/icons-material/Star';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box, Button, Card, CardContent, Chip, Grid, IconButton,
  Stack, Typography, Avatar, Dialog, DialogContent, DialogTitle, TextField, ThemeProvider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { api } from '../../services/api';
import { CardStack } from '../../components/CardStack/CardStack';
import { DeuMatchModal } from '../../components/DeuMatch/DeuMatchModal';
import { ResumeModal } from '../../components/ResumeModal/ResumeModal';
import { darkTheme } from '../../theme/theme';
import { PageTour } from '../../tutorial/PageTour';
import { useTutorial } from '../../tutorial/TutorialContext';
import { buildCandidateHomeSteps } from '../../tutorial/steps';

function JobCard({ match, isActive }: { match: any; isActive: boolean }) {
  const job = match.job;
  const score = match.score;
  const isFeatured = score >= 90;

  return (
    <ThemeProvider theme={darkTheme}>
    <Box
      sx={{
        height: '100%',
        color: '#fff',
        background: 'linear-gradient(160deg, rgba(13,28,51,0.95), rgba(6,19,39,0.98))',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {/* Top row */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack direction="row" spacing={1.5} alignItems="center">
          {isFeatured && (
            <Chip label="Destaque" size="small" sx={{ bgcolor: 'rgba(255,193,7,0.15)', color: '#ffc107', fontWeight: 800, fontSize: '0.7rem' }} />
          )}
        </Stack>
        <Chip
          icon={<StarIcon sx={{ fontSize: '14px !important' }} />}
          label={`${score}% match`}
          color={score >= 90 ? 'success' : 'default'}
          size="small"
          sx={{ fontWeight: 900, bgcolor: score >= 90 ? undefined : 'rgba(91,61,245,0.15)', color: score >= 90 ? undefined : '#5B3DF5' }}
        />
      </Stack>

      {/* Company logo + name */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 52,
            height: 52,
            bgcolor: '#5B3DF5',
            fontSize: '1.2rem',
            fontWeight: 900,
            border: '2px solid rgba(91,61,245,0.3)',
            borderRadius: 2,
            flexShrink: 0
          }}
        >
          {job?.company?.name?.[0] ?? 'E'}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight={900} lineHeight={1.2}>{job?.title}</Typography>
          <Typography color="secondary" fontWeight={700} variant="body2">{job?.company?.name ?? 'Empresa'}</Typography>
        </Box>
      </Stack>

      {/* Meta chips */}
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
        {job?.workModel && (
          <Chip icon={<WorkIcon />} label={job.workModel} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} />
        )}
        {job?.location && (
          <Chip icon={<LocationOnIcon />} label={job.location} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} />
        )}
        {job?.salaryMin && (
          <Chip icon={<AttachMoneyIcon />} label={`R$ ${job.salaryMin.toLocaleString('pt-BR')} – ${job.salaryMax?.toLocaleString('pt-BR')}`} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} />
        )}
      </Stack>

      {/* Skills */}
      {job?.requiredSkills?.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          {job.requiredSkills.slice(0, 5).map((s: string) => (
            <Chip key={s} label={s} size="small" sx={{ bgcolor: 'rgba(91,61,245,0.12)', color: 'primary.main', fontSize: '0.7rem' }} />
          ))}
        </Stack>
      )}

      {/* Description */}
      {job?.description && (
        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mt: 'auto' }}>
          {job.description}
        </Typography>
      )}
    </Box>
    </ThemeProvider>
  );
}

export function CandidatePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState<{ jobTitle: string; company: string } | null>(null);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [pendingDecision, setPendingDecision] = useState<'approved' | 'skipped' | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    headline: '', location: '', workModel: '', yearsExperience: '', desiredSalary: '', skillsText: ''
  });
  const [editSaving, setEditSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const p = await api.getCandidateMe();
      setProfile(p);
      if (p) {
        const q = await api.getCandidateQueue();
        setQueue(q);
        setCurrentIndex(0);
        setLastAction(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const { requestAutoStart } = useTutorial();
  useEffect(() => {
    if (loading) return;
    const resumeReady = (profile?.skills?.length ?? 0) > 0 || (profile?.yearsExperience ?? 0) > 0;
    if (resumeReady && api.getCurrentUser()?.role !== 'recruiter') {
      requestAutoStart('candidate');
    }
  }, [loading, profile]);

  const hasQueue = currentIndex < queue.length;
  const tourSteps = useMemo(() => buildCandidateHomeSteps({ hasQueue }), [hasQueue]);

  const openEdit = () => {
    setEditForm({
      headline: profile?.headline ?? '',
      location: profile?.location ?? '',
      workModel: profile?.workModel ?? '',
      yearsExperience: profile?.yearsExperience ? String(profile.yearsExperience) : '',
      desiredSalary: profile?.desiredSalary ? String(profile.desiredSalary) : '',
      skillsText: (profile?.skills ?? []).join(', ')
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!profile?.id) return;
    setEditSaving(true);
    try {
      const updated = await api.updateCandidate(profile.id, {
        headline: editForm.headline,
        location: editForm.location,
        workModel: editForm.workModel,
        yearsExperience: editForm.yearsExperience ? parseInt(editForm.yearsExperience) : undefined,
        desiredSalary: editForm.desiredSalary ? parseInt(editForm.desiredSalary) : undefined,
        skills: editForm.skillsText.split(',').map(s => s.trim()).filter(Boolean)
      });
      setProfile(updated);
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  };

  const currentUser = api.getCurrentUser();
  if (currentUser?.role === 'recruiter') {
    return (
      <Box maxWidth={560} mx="auto" mt={6} textAlign="center">
        <Card sx={{ p: 4, border: '1px solid rgba(91,61,245,0.3)' }}>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#5B3DF5' }}>
                <PersonSearchIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h5" fontWeight={900}>Área do Candidato</Typography>
              <Typography color="text.secondary">Você está logado como Recrutador. Acesse com uma conta de Candidato.</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="grid" sx={{ placeItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h5" color="text.secondary">Carregando...</Typography>
      </Box>
    );
  }

  const hasResume = profile?.skills?.length > 0 || profile?.yearsExperience > 0;

  if (!hasResume) {
    return (
      <Box maxWidth={560} mx="auto" mt={6} textAlign="center">
        <Card sx={{ p: 5, border: '1px solid rgba(34,211,238,0.2)' }}>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: '#22D3EE' }}>
                <PersonSearchIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h5" fontWeight={900}>Envie seu currículo</Typography>
              <Typography color="text.secondary" maxWidth={360}>
                Nossa IA extrai suas competências e começa a recomendar vagas perfeitas para você.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/candidate/onboarding')}
                sx={{ background: 'linear-gradient(135deg, #22D3EE, #0EA5C4)', fontWeight: 800, px: 4 }}
              >
                Enviar currículo agora
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handleSwipe = (decision: 'approved' | 'skipped') => {
    if (currentIndex >= queue.length || swipeDir) return;
    setPendingDecision(decision);
    setSwipeDir(decision === 'approved' ? 'right' : 'left');
  };

  const handleSwipeAnimationEnd = async () => {
    const decision = pendingDecision;
    const match = queue[currentIndex];
    setSwipeDir(null);
    setPendingDecision(null);
    if (!decision || !match) return;
    try {
      const res = await api.swipeJob(match.id, decision);
      setLastAction({ matchId: match.id, index: currentIndex, decision });
      setCurrentIndex(p => p + 1);
      if (res.isMutual) {
        setMatchModal({ jobTitle: match.job?.title ?? 'Vaga', company: match.job?.company?.name ?? 'Empresa' });
      }
    } catch (err) { console.error(err); }
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    try {
      await api.undoSwipe(lastAction.matchId, 'candidate');
      setCurrentIndex(lastAction.index);
      setLastAction(null);
    } catch (err) { console.error(err); }
  };

  const currentMatch = currentIndex < queue.length ? queue[currentIndex] : null;

  return (
    <Grid container spacing={3} alignItems="flex-start">
      {/* Left: profile summary */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Card data-tour="candidate-profile" sx={{ border: '1px solid rgba(34,211,238,0.15)', position: 'sticky', top: 80 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={900} color="secondary">
                Visão do Candidato
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={profile?.user?.avatar} sx={{ width: 48, height: 48, bgcolor: '#0EA5C4', fontWeight: 900 }}>
                  {profile?.user?.name?.[0] ?? 'C'}
                </Avatar>
                <Box>
                  <Typography fontWeight={800}>{profile?.user?.name}</Typography>
                  <Typography variant="body2" color="secondary" fontWeight={700}>{profile?.headline}</Typography>
                </Box>
              </Stack>
              <Stack spacing={0.75}>
                {profile?.location && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{profile.location}</Typography>
                  </Stack>
                )}
                {profile?.workModel && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WorkIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{profile.workModel}</Typography>
                  </Stack>
                )}
                {profile?.yearsExperience > 0 && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">{profile.yearsExperience} anos de exp.</Typography>
                  </Stack>
                )}
                {profile?.desiredSalary && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoneyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">R$ {profile.desiredSalary.toLocaleString('pt-BR')}</Typography>
                  </Stack>
                )}
              </Stack>
              {profile?.skills?.length > 0 && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                  {profile.skills.slice(0, 6).map((s: string) => (
                    <Chip key={s} label={s} size="small" sx={{ bgcolor: 'rgba(34,211,238,0.1)', color: 'secondary.main', fontSize: '0.7rem' }} />
                  ))}
                </Stack>
              )}
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" color="secondary" size="small" fullWidth onClick={() => setResumeOpen(true)}>
                  Ver currículo
                </Button>
                <Button variant="outlined" color="secondary" size="small" fullWidth onClick={() => navigate('/candidate/onboarding')}>
                  Reenviar PDF
                </Button>
              </Stack>
              <Button variant="text" color="secondary" size="small" startIcon={<EditIcon fontSize="small" />} onClick={openEdit}>
                Editar dados manualmente
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Right: job stack */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Box>
          <Typography variant="h5" fontWeight={900} mb={0.5}>
            Vagas recomendadas
          </Typography>
          <Typography color="text.secondary" variant="body2" mb={3}>Vagas relevantes e aplicação em um deslize.</Typography>

          {currentMatch ? (
            <>
              <Box data-tour="job-stack">
                <CardStack
                  items={queue.slice(currentIndex)}
                  activeIndex={0}
                  height={460}
                  swipeDirection={swipeDir}
                  onSwipeAnimationEnd={handleSwipeAnimationEnd}
                  renderCard={(match, isActive) => <JobCard match={match} isActive={isActive} />}
                />
              </Box>

              {/* Swipe actions */}
              <Stack data-tour="swipe-actions" direction="row" justifyContent="center" spacing={3} mt={3} alignItems="center">
                <Box textAlign="center">
                  <IconButton
                    color="error"
                    onClick={() => handleSwipe('skipped')}
                    disabled={!!swipeDir}
                    sx={{ width: 72, height: 72, border: '2px solid', borderColor: 'error.main', boxShadow: '0 0 20px rgba(255,93,115,0.2)', transition: 'transform 0.1s', '&:hover': { boxShadow: '0 0 30px rgba(255,93,115,0.4)', transform: 'scale(1.08)' } }}
                  >
                    <CloseIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>Pular</Typography>
                </Box>

                <Box textAlign="center">
                  <IconButton
                    color="primary"
                    onClick={handleUndo}
                    disabled={!lastAction || !!swipeDir}
                    sx={{ width: 56, height: 56, border: '2px solid', borderColor: lastAction ? 'primary.main' : 'action.disabled' }}
                  >
                    <RestartAltIcon sx={{ fontSize: 24 }} />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>Desfazer</Typography>
                </Box>

                <Box textAlign="center">
                  <IconButton
                    color="success"
                    onClick={() => handleSwipe('approved')}
                    disabled={!!swipeDir}
                    sx={{ width: 72, height: 72, border: '2px solid', borderColor: 'success.main', boxShadow: '0 0 20px rgba(16,217,155,0.2)', transition: 'transform 0.1s', '&:hover': { boxShadow: '0 0 30px rgba(16,217,155,0.4)', transform: 'scale(1.08)' } }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>Tenho interesse</Typography>
                </Box>
              </Stack>

              <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                {queue.length - currentIndex} vagas restantes
              </Typography>
            </>
          ) : (
            <Card sx={{ minHeight: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} mb={1}>Tudo limpo!</Typography>
                <Typography color="text.secondary" mb={3} maxWidth={360}>
                  Você já respondeu a todas as vagas disponíveis. Atualize seu currículo para reavaliar seu perfil.
                </Typography>
                {lastAction && (
                  <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleUndo} sx={{ mr: 1 }}>
                    Desfazer última ação
                  </Button>
                )}
                <Button variant="outlined" color="secondary" onClick={() => navigate('/candidate/onboarding')}>
                  Atualizar currículo
                </Button>
              </CardContent>
            </Card>
          )}
        </Box>
      </Grid>

      <DeuMatchModal
        open={!!matchModal}
        onClose={() => setMatchModal(null)}
        candidateName={currentUser?.name}
        jobTitle={matchModal ? `${matchModal.jobTitle} na ${matchModal.company}` : undefined}
      />

      <ResumeModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        candidate={profile}
        parsedPayload={profile?.parsedPayload}
      />

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar dados do perfil</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} pt={1}>
            <TextField
              label="Título profissional"
              value={editForm.headline}
              onChange={e => setEditForm(f => ({ ...f, headline: e.target.value }))}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Localização"
                value={editForm.location}
                onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Modelo de trabalho"
                value={editForm.workModel}
                onChange={e => setEditForm(f => ({ ...f, workModel: e.target.value }))}
                placeholder="Remote, Hybrid, Onsite"
                fullWidth
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Anos de experiência"
                type="number"
                value={editForm.yearsExperience}
                onChange={e => setEditForm(f => ({ ...f, yearsExperience: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Pretensão salarial (R$)"
                type="number"
                value={editForm.desiredSalary}
                onChange={e => setEditForm(f => ({ ...f, desiredSalary: e.target.value }))}
                fullWidth
              />
            </Stack>
            <TextField
              label="Skills"
              value={editForm.skillsText}
              onChange={e => setEditForm(f => ({ ...f, skillsText: e.target.value }))}
              helperText="Separe por vírgula"
              fullWidth
              multiline
              rows={2}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setEditOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={handleSaveEdit} disabled={editSaving}>
                Salvar
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <PageTour
        area="candidate"
        segment={0}
        steps={tourSteps}
        nextRoute="/matches"
      />
    </Grid>
  );
}
