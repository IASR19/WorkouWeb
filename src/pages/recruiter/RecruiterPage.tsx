import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StarIcon from "@mui/icons-material/Star";
import TimerIcon from "@mui/icons-material/Timer";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EditIcon from "@mui/icons-material/Edit";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";
import { MetricCard } from "../../shared/ui/MetricCard";
import { CardStack } from "../../components/CardStack/CardStack";
import { DeuMatchModal } from "../../components/DeuMatch/DeuMatchModal";
import { ResumeModal } from "../../components/ResumeModal/ResumeModal";
import { darkTheme } from "../../theme/theme";
import { PageTour } from "../../tutorial/PageTour";
import { useTutorial } from "../../tutorial/TutorialContext";
import { RECRUITER_HOME_STEPS } from "../../tutorial/steps";
import { DEMO_JOB, DEMO_RECRUITER_MATCH } from "../../tutorial/demoData";

function getInitials(name?: string) {
  if (!name) return "P";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function CandidateCard({
  match,
  isActive,
  onClick,
}: {
  match: any;
  isActive: boolean;
  onClick: () => void;
}) {
  const candidate = match.candidate;
  const score = match.score;
  const isDemo = match.id === DEMO_RECRUITER_MATCH.id;

  return (
    <ThemeProvider theme={darkTheme}>
    <Box
      onClick={isActive ? onClick : undefined}
      sx={{
        position: "relative",
        height: "100%",
        color: "#fff",
        background:
          "linear-gradient(160deg, rgba(13,28,51,0.95), rgba(6,19,39,0.98))",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        cursor: isActive ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {isDemo && (
        <Chip
          label="Exemplo do tour"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            bgcolor: "#ffc107",
            color: "#0B1220",
            fontWeight: 900,
            fontSize: "0.65rem",
          }}
        />
      )}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={candidate?.user?.avatar}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "#5B3DF5",
              fontSize: "1.1rem",
              fontWeight: 900,
              border: "2px solid rgba(34,211,238,0.4)",
            }}
          >
            {getInitials(candidate?.user?.name)}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={900} lineHeight={1.2}>
              {candidate?.user?.name}
            </Typography>
            <Typography color="secondary" fontWeight={700} variant="body2">
              {candidate?.headline}
            </Typography>
          </Box>
        </Stack>
        <Chip
          icon={<StarIcon sx={{ fontSize: "14px !important" }} />}
          label={`${score}% match`}
          color={score >= 90 ? "success" : "default"}
          size="small"
          sx={{
            fontWeight: 900,
            bgcolor: score >= 90 ? undefined : "rgba(91,61,245,0.2)",
            color: score >= 90 ? undefined : "primary.main",
          }}
        />
      </Stack>

      {candidate?.skills?.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
          {candidate.skills.slice(0, 5).map((s: string) => (
            <Chip
              key={s}
              label={s}
              size="small"
              sx={{
                bgcolor: "rgba(34,211,238,0.1)",
                color: "secondary.main",
                fontSize: "0.7rem",
              }}
            />
          ))}
        </Stack>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Typography color="text.secondary" variant="caption" display="block">
            Experiência
          </Typography>
          <Typography fontWeight={700} variant="body2">
            {candidate?.yearsExperience} anos
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography color="text.secondary" variant="caption" display="block">
            Pretensão
          </Typography>
          <Typography fontWeight={700} variant="body2">
            R$ {candidate?.desiredSalary?.toLocaleString("pt-BR") ?? "–"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography color="text.secondary" variant="caption" display="block">
            Localização
          </Typography>
          <Typography fontWeight={700} variant="body2">
            {candidate?.location ?? "–"}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography color="text.secondary" variant="caption" display="block">
            Modelo
          </Typography>
          <Typography fontWeight={700} variant="body2">
            {candidate?.workModel ?? "Presencial"}
          </Typography>
        </Grid>
      </Grid>

      {isActive && (
        <Typography
          variant="caption"
          color="text.secondary"
          textAlign="center"
          mt="auto"
        >
          Clique para ver currículo completo
        </Typography>
      )}
    </Box>
    </ThemeProvider>
  );
}

export function RecruiterPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [queue, setQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<any>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState<{
    candidateName: string;
    jobTitle: string;
  } | null>(null);
  const [resumeModal, setResumeModal] = useState<any>(null);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [pendingDecision, setPendingDecision] = useState<
    "approved" | "skipped" | null
  >(null);

  const fetchJobs = async () => {
    try {
      const { items: jobList } = await api.getJobs();
      setJobs(jobList);
      if (jobList.length > 0) {
        setSelectedJobId(prev => jobList.some((j: any) => j.id === prev) ? prev : jobList[0].id);
      } else {
        // Se não tem vagas, para de carregar
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchQueue = async (jobId: string) => {
    if (!jobId) return;
    setLoading(true);
    try {
      const q = await api.getRecruiterQueue(jobId);
      setQueue(q);
      setCurrentIndex(0);
      setLastAction(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  useEffect(() => {
    if (selectedJobId) fetchQueue(selectedJobId);
  }, [selectedJobId]);

  const { requestAutoStart, state: tutorialState } = useTutorial();
  useEffect(() => {
    if (api.getCurrentUser()?.role === "recruiter") requestAutoStart("recruiter");
  }, []);

  const isTourStepActive = tutorialState.running && tutorialState.activeArea === "recruiter" && tutorialState.segment === 0;
  const isDemoingJobs = isTourStepActive && jobs.length === 0;
  const isDemoingQueue = isTourStepActive && currentIndex >= queue.length;

  const handleToggleJobStatus = async (jobId: string, current: "draft" | "open" | "paused" | "closed") => {
    const next: "open" | "paused" = current === "paused" ? "open" : "paused";
    try {
      await api.setJobStatus(jobId, next);
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!window.confirm("Excluir esta vaga? Essa ação não pode ser desfeita.")) return;
    try {
      await api.deleteJob(jobId);
      setSelectedJobId("");
      await fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const currentUser = api.getCurrentUser();
  if (currentUser?.role === "candidate") {
    return (
      <Box maxWidth={560} mx="auto" mt={6} textAlign="center">
        <Card sx={{ p: 4, border: "1px solid rgba(91,61,245,0.3)" }}>
          <CardContent>
            <Stack spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#5B3DF5",
                }}
              >
                <BusinessCenterIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h5" fontWeight={900}>
                Painel do Recrutador
              </Typography>
              <Typography color="text.secondary">
                Você está logado como Candidato. Acesse com uma conta de
                Recrutador.
              </Typography>
              <Alert severity="info" sx={{ width: "100%", textAlign: "left" }}>
                <strong>E-mail:</strong> recruiter@workou.dev
                <br />
                <strong>Senha:</strong> workoudev2026
              </Alert>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const handleSwipe = (decision: "approved" | "skipped") => {
    if (currentIndex >= queue.length || swipeDir) return;
    setPendingDecision(decision);
    setSwipeDir(decision === "approved" ? "right" : "left");
  };

  const handleSwipeAnimationEnd = async () => {
    const decision = pendingDecision;
    const match = queue[currentIndex];
    setSwipeDir(null);
    setPendingDecision(null);
    if (!decision || !match) return;
    try {
      const res = await api.swipeCandidate(match.id, decision);
      setLastAction({ matchId: match.id, index: currentIndex, decision });
      if (decision === "approved") setApprovedCount((p) => p + 1);
      setCurrentIndex((p) => p + 1);
      if (res.isMutual) {
        const job = jobs.find((j) => j.id === selectedJobId);
        setMatchModal({
          candidateName: match.candidate?.user?.name ?? "Candidato",
          jobTitle: job?.title ?? "Vaga",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUndo = async () => {
    if (!lastAction) return;
    try {
      await api.undoSwipe(lastAction.matchId, "recruiter");
      if (lastAction.decision === "approved")
        setApprovedCount((p) => Math.max(0, p - 1));
      setCurrentIndex(lastAction.index);
      setLastAction(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCardClick = (match: any) => {
    setResumeModal(match);
  };

  const currentMatch = currentIndex < queue.length ? queue[currentIndex] : null;
  const currentJob = jobs.find((j) => j.id === selectedJobId);

  const displayJobs = isDemoingJobs ? [DEMO_JOB] : jobs;
  const displayCurrentJob = isDemoingJobs ? DEMO_JOB : currentJob;
  const displayMatch = isDemoingQueue ? DEMO_RECRUITER_MATCH : currentMatch;

  if (loading) {
    return (
      <Box display="grid" sx={{ placeItems: "center", minHeight: "60vh" }}>
        <Typography variant="h5" color="text.secondary">
          Carregando...
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", md: "center" }}
        gap={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={900}>
            Dashboard do Recrutador
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Triagem em segundos com mecânica intuitiva.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" rowGap={1.5}>
          {displayJobs.length > 0 ? (
            <FormControl data-tour="job-selector" sx={{ minWidth: { xs: "100%", sm: 240 } }}>
              <InputLabel>Vaga em Triagem</InputLabel>
              <Select
                value={isDemoingJobs ? DEMO_JOB.id : selectedJobId}
                label="Vaga em Triagem"
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                {displayJobs.map((j) => (
                  <MenuItem key={j.id} value={j.id}>
                    {j.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null}
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" rowGap={1}>
            {currentJob && (
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Editar vaga">
                  <IconButton size="small" onClick={() => navigate(`/recruiter/create-job?edit=${currentJob.id}`)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={currentJob.status === "paused" ? "Reabrir vaga" : "Pausar vaga"}>
                  <IconButton size="small" onClick={() => handleToggleJobStatus(currentJob.id, currentJob.status)}>
                    {currentJob.status === "paused" ? <PlayArrowIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Excluir vaga">
                  <IconButton size="small" color="error" onClick={() => handleDeleteJob(currentJob.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
            <Tooltip title="Criar nova vaga">
              <Button
                data-tour="new-job-btn"
                variant="outlined"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => navigate("/recruiter/create-job")}
                sx={{ flexShrink: 0 }}
              >
                Nova Vaga
              </Button>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>

      {/* Metrics */}
      <Grid data-tour="metrics" container spacing={{ xs: 1, sm: 2 }}>
        <Grid size={{ xs: 3 }}>
          <MetricCard
            icon={<GroupsIcon color="primary" />}
            value={isDemoingQueue ? "1" : String(queue.length)}
            label="Na fila"
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <MetricCard
            icon={<CheckCircleIcon color="success" />}
            value={String(approvedCount)}
            label="Aprovados"
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <MetricCard
            icon={<TimerIcon color="secondary" />}
            value="–"
            label="Tempo médio"
          />
        </Grid>
        <Grid size={{ xs: 3 }}>
          <MetricCard
            icon={<StarIcon color="primary" />}
            value={displayMatch ? `${displayMatch.score}%` : "–"}
            label="Match atual"
          />
        </Grid>
      </Grid>

      {/* Main content */}
      {displayJobs.length === 0 ? (
        <Card
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px dashed rgba(91,61,245,0.3)",
          }}
        >
          <CardContent>
            <Stack spacing={2} alignItems="center">
              <BusinessCenterIcon
                sx={{ fontSize: 48, color: "rgba(91,61,245,0.4)" }}
              />
              <Typography variant="h5" fontWeight={800}>
                Nenhuma vaga publicada
              </Typography>
              <Typography color="text.secondary">
                Publique sua primeira vaga para começar a receber candidatos.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/recruiter/create-job")}
                sx={{
                  background: "linear-gradient(135deg, #5B3DF5, #22D3EE)",
                  fontWeight: 800,
                }}
              >
                Criar primeira vaga
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3} alignItems="flex-start">
          {/* Job info panel */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                border: "1px solid rgba(91,61,245,0.15)",
                position: "sticky",
                top: 80,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={0.5}>
                  {displayCurrentJob?.title}
                </Typography>
                <Typography color="text.secondary" variant="body2" mb={2}>
                  {displayCurrentJob?.company?.name ?? "Sua empresa"}
                </Typography>
                {displayCurrentJob?.requiredSkills?.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={0.5}
                    flexWrap="wrap"
                    gap={0.5}
                    mb={2}
                  >
                    {displayCurrentJob.requiredSkills.map((s: string) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        sx={{
                          bgcolor: "rgba(91,61,245,0.1)",
                          color: "#5B3DF5",
                        }}
                      />
                    ))}
                  </Stack>
                )}
                <Stack spacing={1}>
                  {displayCurrentJob?.workModel && (
                    <Typography variant="body2" color="text.secondary">
                      Modelo: <strong>{displayCurrentJob.workModel}</strong>
                    </Typography>
                  )}
                  {displayCurrentJob?.salaryMin && (
                    <Typography variant="body2" color="text.secondary">
                      Salário:{" "}
                      <strong>
                        R$ {displayCurrentJob.salaryMin.toLocaleString("pt-BR")} – R${" "}
                        {displayCurrentJob.salaryMax?.toLocaleString("pt-BR")}
                      </strong>
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card stack */}
          <Grid size={{ xs: 12, md: 8 }}>
            {displayMatch ? (
              <Box>
                <Box data-tour="card-stack">
                  <CardStack
                    items={isDemoingQueue ? [DEMO_RECRUITER_MATCH] : queue.slice(currentIndex)}
                    activeIndex={0}
                    height={340}
                    swipeDirection={swipeDir}
                    onSwipeAnimationEnd={handleSwipeAnimationEnd}
                    renderCard={(match, isActive) => (
                      <CandidateCard
                        match={match}
                        isActive={isActive}
                        onClick={() => handleCardClick(match)}
                      />
                    )}
                  />
                </Box>

                {/* Swipe actions */}
                <Stack
                  data-tour="swipe-actions"
                  direction="row"
                  justifyContent="center"
                  spacing={3}
                  mt={3}
                >
                  <IconButton
                    color="error"
                    onClick={() => handleSwipe("skipped")}
                    disabled={!!swipeDir || isDemoingQueue}
                    sx={{
                      width: 72,
                      height: 72,
                      border: "2px solid",
                      borderColor: "error.main",
                      boxShadow: "0 0 20px rgba(255,93,115,0.2)",
                      transition: "transform 0.1s",
                      "&:hover": {
                        boxShadow: "0 0 30px rgba(255,93,115,0.4)",
                        transform: "scale(1.08)",
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 32 }} />
                  </IconButton>

                  <IconButton
                    color="primary"
                    onClick={handleUndo}
                    disabled={!lastAction || !!swipeDir || isDemoingQueue}
                    sx={{
                      width: 56,
                      height: 56,
                      border: "2px solid",
                      borderColor: lastAction
                        ? "primary.main"
                        : "action.disabled",
                    }}
                  >
                    <RestartAltIcon sx={{ fontSize: 24 }} />
                  </IconButton>

                  <IconButton
                    color="success"
                    onClick={() => handleSwipe("approved")}
                    disabled={!!swipeDir || isDemoingQueue}
                    sx={{
                      width: 72,
                      height: 72,
                      border: "2px solid",
                      borderColor: "success.main",
                      boxShadow: "0 0 20px rgba(16,217,155,0.2)",
                      transition: "transform 0.1s",
                      "&:hover": {
                        boxShadow: "0 0 30px rgba(16,217,155,0.4)",
                        transform: "scale(1.08)",
                      },
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 32 }} />
                  </IconButton>
                </Stack>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="center"
                  mt={1}
                >
                  {isDemoingQueue
                    ? "Exemplo — candidatos reais aparecem aqui assim que se candidatarem"
                    : `${queue.length - currentIndex} candidatos restantes`}
                </Typography>
              </Box>
            ) : (
              <Card
                sx={{
                  minHeight: 480,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px dashed rgba(255,255,255,0.1)",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight={800} mb={1}>
                    Triagem concluída!
                  </Typography>
                  <Typography color="text.secondary" mb={3}>
                    Não há mais candidatos na fila desta vaga.
                  </Typography>
                  {lastAction && (
                    <Button
                      variant="outlined"
                      startIcon={<RestartAltIcon />}
                      onClick={handleUndo}
                    >
                      Desfazer última decisão
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}

      {/* Modals */}
      <DeuMatchModal
        open={!!matchModal}
        onClose={() => setMatchModal(null)}
        candidateName={matchModal?.candidateName}
        jobTitle={matchModal?.jobTitle}
      />

      {resumeModal && (
        <ResumeModal
          open={!!resumeModal}
          onClose={() => setResumeModal(null)}
          candidate={resumeModal.candidate ?? {}}
          matchScore={resumeModal.score}
          parsedPayload={resumeModal.candidate?.parsedPayload ?? {}}
        />
      )}

      <PageTour
        area="recruiter"
        segment={0}
        steps={RECRUITER_HOME_STEPS}
        nextRoute="/matches"
      />
    </Stack>
  );
}
