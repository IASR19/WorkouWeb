import { useState, useEffect, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";
import { PageTour } from "../../tutorial/PageTour";
import { COMPANY_HOME_STEPS } from "../../tutorial/steps";

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  essencial: { label: "Essencial", color: "#5B3DF5" },
  pro: { label: "Pro", color: "#22D3EE" },
  business: { label: "Business", color: "#ffc107" },
  enterprise: { label: "Enterprise", color: "#ff5d73" },
};

export function CompanyDashboard() {
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "seats" | "billing">("overview");

  // Add seat dialog
  const [addSeatOpen, setAddSeatOpen] = useState(false);
  const [seatName, setSeatName] = useState("");
  const [seatEmail, setSeatEmail] = useState("");
  const [seatPassword, setSeatPassword] = useState("");
  const [seatError, setSeatError] = useState("");
  const [seatLoading, setSeatLoading] = useState(false);
  const [seatSuccess, setSeatSuccess] = useState("");

  const load = useCallback(async () => {
    try {
      const [c, p, s, b] = await Promise.all([
        api.getMyCompany(),
        api.getMyRecruiterProfile(),
        api.getSeats(),
        api.getBillingRecords(),
      ]);
      setCompany(c);
      setProfile(p);
      setSeats(s);
      setBilling(b);
    } catch {
      // not a recruiter or no company
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isOwner = profile?.companyRole === "owner";

  useEffect(() => {
    load();
  }, [load]);

  const handleAddSeat = async () => {
    if (!seatName || !seatEmail || seatPassword.length < 6) {
      setSeatError("Preencha todos os campos (senha mínimo 6 caracteres).");
      return;
    }
    setSeatError("");
    setSeatLoading(true);
    try {
      await api.addSeat({
        name: seatName,
        email: seatEmail,
        password: seatPassword,
      });
      setSeatSuccess("Gestor adicionado com sucesso! Seats são ilimitados, sem custo extra.");
      setSeatName("");
      setSeatEmail("");
      setSeatPassword("");
      await load();
    } catch (err: any) {
      setSeatError(err?.response?.data?.message ?? "Erro ao adicionar gestor.");
    } finally {
      setSeatLoading(false);
    }
  };

  const handleRemoveSeat = async (profileId: string) => {
    try {
      await api.removeSeat(profileId);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message ?? "Erro ao remover gestor.");
    }
  };

  const currentUser = api.getCurrentUser();

  if (currentUser?.role !== "recruiter") {
    return (
      <Box maxWidth={560} mx="auto" mt={6} textAlign="center">
        <Card sx={{ p: 4, border: "1px solid rgba(91,61,245,0.3)" }}>
          <CardContent>
            <Typography variant="h5" fontWeight={900} mb={2}>
              Acesso restrito
            </Typography>
            <Typography color="text.secondary">
              Esta área é exclusiva para Recrutadores.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="grid" sx={{ placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box maxWidth={560} mx="auto" mt={6} textAlign="center">
        <Card sx={{ p: 4, border: "1px solid rgba(91,61,245,0.3)" }}>
          <CardContent>
            <Typography variant="h5" fontWeight={900} mb={2}>
              Empresa não encontrada
            </Typography>
            <Typography color="text.secondary" mb={3}>
              Você ainda não tem uma empresa cadastrada.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                background: "linear-gradient(135deg,#5B3DF5,#22D3EE)",
                fontWeight: 800,
              }}
            >
              Cadastrar empresa
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const planInfo = PLAN_LABELS[company.plan] ?? {
    label: company.plan ?? "Sem plano",
    color: "#666",
  };
  const totalSeats = company.seatsAllowed + company.extraSeats;
  const activeSeats = seats.filter((s) => s.isActive).length;
  const jobsLeft = Math.max(
    0,
    company.jobsPerMonth + company.extraJobs - company.jobsPostedThisMonth,
  );

  const tabStyle = (t: typeof tab) => ({
    py: 1,
    px: 2.5,
    borderRadius: 2,
    fontWeight: tab === t ? 800 : 500,
    bgcolor: tab === t ? "rgba(91,61,245,0.15)" : "transparent",
    color: tab === t ? "primary.main" : "text.secondary",
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <Box maxWidth={960} mx="auto">
      {/* Header */}
      <Stack
        data-tour="company-header"
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "flex-start" }}
        gap={2}
        mb={3}
      >
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "#5B3DF5",
                display: "grid",
                placeItems: "center",
              }}
            >
              <BusinessIcon sx={{ color: "#fff" }} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={900}>
                {company.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={planInfo.label}
                  size="small"
                  sx={{
                    bgcolor: `${planInfo.color}22`,
                    color: planInfo.color,
                    fontWeight: 800,
                    fontSize: "0.7rem",
                  }}
                />
                {company.industry && (
                  <Typography color="text.secondary" variant="body2">
                    {company.industry}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        </Box>
        {isOwner && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<StarIcon />}
            onClick={() => navigate("/plans")}
            sx={{ borderColor: "primary.main", color: "primary.main", fontWeight: 700 }}
          >
            Upgrade de plano
          </Button>
        )}
      </Stack>

      {/* Quick stats */}
      <Grid data-tour="company-metrics" container spacing={2} mb={3}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ border: "1px solid rgba(91,61,245,0.15)" }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PeopleIcon sx={{ color: "primary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    {activeSeats} / {totalSeats === 9999 ? "∞" : totalSeats}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Gestores de RH
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ border: "1px solid rgba(34,211,238,0.15)" }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <WorkIcon sx={{ color: "secondary.main", fontSize: 28 }} />
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    {jobsLeft === 9999 ? "∞" : jobsLeft} restantes
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Vagas disponíveis este mês
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Card sx={{ border: "1px solid rgba(255,193,7,0.15)" }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ReceiptIcon sx={{ color: "#ffc107", fontSize: 28 }} />
                <Box>
                  <Typography variant="h5" fontWeight={900}>
                    {billing.length}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Cobranças realizadas
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Stack data-tour="company-tabs" direction="row" spacing={1} mb={3} flexWrap="wrap" rowGap={1}>
        <Box sx={tabStyle("overview")} onClick={() => setTab("overview")}>
          Visão geral
        </Box>
        <Box sx={tabStyle("seats")} onClick={() => setTab("seats")}>
          Gestores de RH
        </Box>
        <Box sx={tabStyle("billing")} onClick={() => setTab("billing")}>
          Cobranças
        </Box>
      </Stack>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{ border: "1px solid rgba(91,61,245,0.15)", height: "100%" }}
            >
              <CardContent>
                <Typography variant="subtitle1" fontWeight={800} mb={2}>
                  Plano atual
                </Typography>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Plano</Typography>
                    <Chip
                      label={planInfo.label}
                      size="small"
                      sx={{
                        bgcolor: `${planInfo.color}22`,
                        color: planInfo.color,
                        fontWeight: 800,
                      }}
                    />
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">
                      Seats incluídos
                    </Typography>
                    <Typography fontWeight={700}>
                      {company.seatsAllowed === 9999
                        ? "Ilimitado"
                        : company.seatsAllowed}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Vagas/mês</Typography>
                    <Typography fontWeight={700}>
                      {company.jobsPerMonth === 9999
                        ? "Ilimitado"
                        : company.jobsPerMonth}
                    </Typography>
                  </Stack>
                  {company.planExpiresAt && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Vence em</Typography>
                      <Typography fontWeight={700}>
                        {new Date(company.planExpiresAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </Typography>
                    </Stack>
                  )}
                  <Divider />
                  <Button
                    data-tour="company-upgrade"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate("/plans")}
                    sx={{
                      background: "linear-gradient(135deg,#5B3DF5,#4C2FE0)",
                      fontWeight: 800,
                    }}
                  >
                    Fazer upgrade
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{ border: "1px solid rgba(34,211,238,0.15)", height: "100%" }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="subtitle1" fontWeight={800}>
                    Gestores de RH
                  </Typography>
                  {isOwner && (
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setTab("seats");
                        setAddSeatOpen(true);
                      }}
                      sx={{ color: "secondary.main", fontWeight: 700 }}
                    >
                      Adicionar
                    </Button>
                  )}
                </Stack>
                <Stack spacing={1}>
                  {seats
                    .filter((s) => s.isActive)
                    .slice(0, 4)
                    .map((s: any) => (
                      <Stack
                        key={s.id}
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#5B3DF5",
                            fontSize: "0.8rem",
                            fontWeight: 900,
                          }}
                        >
                          {s.user?.name?.[0]}
                        </Avatar>
                        <Box flex={1}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            lineHeight={1.2}
                          >
                            {s.user?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {s.user?.email}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            s.companyRole === "owner"
                              ? "Proprietário"
                              : "Gestor"
                          }
                          size="small"
                          sx={{
                            fontSize: "0.65rem",
                            bgcolor:
                              s.companyRole === "owner"
                                ? "rgba(91,61,245,0.15)"
                                : "rgba(255,255,255,0.05)",
                            color:
                              s.companyRole === "owner"
                                ? "primary.main"
                                : "text.secondary",
                          }}
                        />
                      </Stack>
                    ))}
                  {seats.filter((s) => s.isActive).length === 0 && (
                    <Typography color="text.secondary" variant="body2">
                      Nenhum gestor cadastrado ainda.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* SEATS */}
      {tab === "seats" && (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Gestores de RH
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {totalSeats === 9999
                  ? `${activeSeats} gestor${activeSeats !== 1 ? "es" : ""} no time · seats ilimitados`
                  : `${activeSeats} de ${totalSeats} seats em uso`}
              </Typography>
            </Box>
            {isOwner && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSeatSuccess("");
                  setSeatError("");
                  setAddSeatOpen(true);
                }}
                sx={{
                  background: "linear-gradient(135deg,#5B3DF5,#4C2FE0)",
                  fontWeight: 800,
                }}
              >
                Adicionar gestor
              </Button>
            )}
          </Stack>

          {!isOwner && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Apenas o proprietário da empresa pode adicionar ou remover
              gestores de RH.
            </Alert>
          )}

          <Stack spacing={1.5}>
            {seats
              .filter((s) => s.isActive)
              .map((s: any) => (
                <Card
                  key={s.id}
                  sx={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#5B3DF5",
                          fontWeight: 900,
                        }}
                      >
                        {s.user?.name?.[0]}
                      </Avatar>
                      <Box flex={1}>
                        <Typography fontWeight={700}>{s.user?.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {s.user?.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          s.companyRole === "owner"
                            ? "Proprietário"
                            : "Gestor de RH"
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            s.companyRole === "owner"
                              ? "rgba(91,61,245,0.15)"
                              : "rgba(34,211,238,0.1)",
                          color:
                            s.companyRole === "owner" ? "#5B3DF5" : "#22D3EE",
                          fontWeight: 700,
                        }}
                      />
                      {isOwner && s.companyRole !== "owner" && (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveSeat(s.id)}
                          title="Remover gestor"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}

            {seats.filter((s) => s.isActive).length === 0 && (
              <Card
                sx={{
                  border: "1px dashed rgba(255,255,255,0.1)",
                  textAlign: "center",
                  py: 4,
                }}
              >
                <Typography color="text.secondary">
                  Nenhum gestor cadastrado. Adicione gestores de RH ao seu time.
                </Typography>
              </Card>
            )}
          </Stack>

          {/* Add seat dialog */}
          <Dialog
            open={addSeatOpen}
            onClose={() => setAddSeatOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle fontWeight={800}>Adicionar gestor de RH</DialogTitle>
            <DialogContent>
              <Stack spacing={2} pt={1}>
                {seatSuccess && <Alert severity="success">{seatSuccess}</Alert>}
                {seatError && <Alert severity="error">{seatError}</Alert>}

                <Alert severity="info" sx={{ fontSize: "0.8rem" }}>
                  O novo gestor receberá acesso à plataforma como recrutador
                  desta empresa. Seats são ilimitados em todos os planos, sem custo extra.
                </Alert>

                <TextField
                  label="Nome completo"
                  value={seatName}
                  onChange={(e) => setSeatName(e.target.value)}
                  fullWidth
                  autoFocus
                />
                <TextField
                  label="E-mail do gestor"
                  type="email"
                  value={seatEmail}
                  onChange={(e) => setSeatEmail(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Senha inicial"
                  type="password"
                  value={seatPassword}
                  onChange={(e) => setSeatPassword(e.target.value)}
                  fullWidth
                  helperText="O gestor poderá alterar depois"
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setAddSeatOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleAddSeat}
                    disabled={seatLoading}
                    sx={{
                      background: "linear-gradient(135deg,#5B3DF5,#4C2FE0)",
                      fontWeight: 800,
                    }}
                  >
                    {seatLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Adicionar gestor"
                    )}
                  </Button>
                </Stack>
              </Stack>
            </DialogContent>
          </Dialog>
        </Box>
      )}

      {/* BILLING */}
      {tab === "billing" && (
        <Box>
          <Typography variant="h6" fontWeight={800} mb={2}>
            Histórico de cobranças
          </Typography>

          {billing.length === 0 ? (
            <Card
              sx={{
                border: "1px dashed rgba(255,255,255,0.1)",
                textAlign: "center",
                py: 4,
              }}
            >
              <Typography color="text.secondary">
                Nenhuma cobrança registrada ainda.
              </Typography>
            </Card>
          ) : (
            <Stack spacing={1.5}>
              {billing.map((b: any) => (
                <Card
                  key={b.id}
                  sx={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: "rgba(34,211,238,0.1)",
                        }}
                      >
                        <ReceiptIcon sx={{ color: "secondary.main", fontSize: 18 }} />
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight={700}>
                          {b.description}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {new Date(b.createdAt).toLocaleDateString("pt-BR")}
                          </Typography>
                          {b.cardLast4 && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              · Cartão •••• {b.cardLast4}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                      <Box textAlign="right">
                        <Typography fontWeight={900} color="secondary.main">
                          R${" "}
                          {Number(b.amount).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </Typography>
                        <Chip
                          icon={
                            <CheckIcon sx={{ fontSize: "10px !important" }} />
                          }
                          label={
                            b.status === "authorized" ? "Aprovado" : b.status
                          }
                          size="small"
                          sx={{
                            fontSize: "0.65rem",
                            bgcolor: "rgba(16,217,155,0.1)",
                            color: "#10d99b",
                            height: 18,
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      )}

      <PageTour area="recruiter" segment={2} steps={COMPANY_HOME_STEPS} />
    </Box>
  );
}
