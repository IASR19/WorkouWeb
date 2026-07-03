import { useState, useEffect, useCallback } from "react";
import CheckIcon from "@mui/icons-material/Check";
import StarIcon from "@mui/icons-material/Star";
import {
  Alert,
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { api } from "../../services/api";

const PLANS = [
  {
    id: "essencial",
    label: "Essencial",
    price: 299,
    seats: 1,
    jobs: 3,
    extraSeat: 99,
    extraJob: 49,
    color: "#7c4dff",
    highlight: false,
    features: [
      "1 gestor de RH",
      "3 vagas anunciadas/mês",
      "Filtro por IA e match automático",
      "CardStack Tinder-style",
      "Chat com candidatos",
      "Suporte por e-mail",
    ],
  },
  {
    id: "pro",
    label: "Pro",
    price: 699,
    seats: 3,
    jobs: 10,
    extraSeat: 89,
    extraJob: 39,
    color: "#00d3b0",
    highlight: true,
    features: [
      "3 gestores de RH",
      "10 vagas/mês",
      "Filtro por IA e match automático",
      "CardStack Tinder-style",
      "Chat com candidatos",
      "Suporte prioritário",
      "Relatórios de match e conversão",
    ],
  },
  {
    id: "business",
    label: "Business",
    price: 1499,
    seats: 10,
    jobs: 30,
    extraSeat: 79,
    extraJob: 29,
    color: "#ffc107",
    highlight: false,
    features: [
      "10 gestores de RH",
      "30 vagas/mês",
      "Filtro por IA e match automático",
      "CardStack Tinder-style",
      "Chat com candidatos",
      "Suporte dedicado",
      "Dashboard avançado de métricas",
      "API de integração com ATS",
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    price: 3999,
    seats: -1,
    jobs: -1,
    extraSeat: 0,
    extraJob: 0,
    color: "#ff5d73",
    highlight: false,
    features: [
      "Gestores de RH ilimitados",
      "Vagas ilimitadas",
      "Filtro por IA e match automático",
      "CardStack Tinder-style",
      "Chat com candidatos",
      "CSM (Customer Success Manager) dedicado",
      "SLA 99.9% garantido",
      "Treinamento e onboarding da equipe",
      "Integração custom com ATS",
    ],
  },
];

export function PlansPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);

  // payment form
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState("");

  const load = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([
        api.getMyCompany(),
        api.getMyRecruiterProfile(),
      ]);
      setCompany(c);
      setProfile(p);
    } catch {
      // no company
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

  const formatCard = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "");
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2, 4)}` : d;
  };

  const handleSubscribe = async () => {
    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
      setPayError("Preencha todos os dados do cartão.");
      return;
    }
    setPayError("");
    setPayLoading(true);
    try {
      await api.subscribeToPlan({
        plan: selectedPlan!,
        cardNumber,
        cardName,
        cardExpiry,
        cardCvv,
      });
      setPaySuccess(
        `Plano ${PLANS.find((p) => p.id === selectedPlan)?.label} ativado com sucesso! 🎉`,
      );
      await load();
      setTimeout(() => {
        setPayOpen(false);
        setPaySuccess("");
        navigate("/company");
      }, 2200);
    } catch (err: any) {
      setPayError(
        err?.response?.data?.message ?? "Erro ao processar pagamento.",
      );
    } finally {
      setPayLoading(false);
    }
  };

  const openPayment = (planId: string) => {
    setSelectedPlan(planId);
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");
    setPayError("");
    setPaySuccess("");
    setPayOpen(true);
  };

  if (loading)
    return (
      <Box display="grid" sx={{ placeItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );

  const currentPlan = company?.plan;
  const chosenPlan = PLANS.find((p) => p.id === selectedPlan);

  return (
    <Box maxWidth={1100} mx="auto">
      <Box textAlign="center" mb={5}>
        <Typography variant="h4" fontWeight={900} mb={1}>
          Escolha o plano ideal para{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(45deg,#7c4dff,#00d3b0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            sua empresa
          </Box>
        </Typography>
        <Typography color="text.secondary" maxWidth={520} mx="auto">
          Contrate talentos com IA, CardStack estilo Tinder e chat integrado.
          Comece hoje, escale quando quiser.
        </Typography>
        {currentPlan && (
          <Chip
            label={`Plano atual: ${PLANS.find((p) => p.id === currentPlan)?.label ?? currentPlan}`}
            sx={{
              mt: 2,
              fontWeight: 800,
              bgcolor: "rgba(124,77,255,0.15)",
              color: "#7c4dff",
            }}
          />
        )}
      </Box>

      {!isOwner && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Apenas o proprietário da empresa pode alterar o plano de assinatura.
        </Alert>
      )}

      <Grid container spacing={3} alignItems="stretch">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          return (
            <Grid key={plan.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: plan.highlight
                    ? `2px solid ${plan.color}`
                    : isCurrent
                      ? "2px solid rgba(255,255,255,0.25)"
                      : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: plan.highlight
                    ? `0 0 32px ${plan.color}33`
                    : "none",
                  position: "relative",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: plan.color,
                    boxShadow: `0 0 24px ${plan.color}33`,
                  },
                }}
              >
                {plan.highlight && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    <Chip
                      icon={<StarIcon sx={{ fontSize: "12px !important" }} />}
                      label="Mais popular"
                      size="small"
                      sx={{
                        bgcolor: plan.color,
                        color: "#000",
                        fontWeight: 900,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                )}
                {isCurrent && (
                  <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                    <Chip
                      label="Atual"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.1)",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                      }}
                    />
                  </Box>
                )}

                <CardContent
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6" fontWeight={900} mb={0.5}>
                    {plan.label}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="baseline"
                    spacing={0.5}
                    mb={0.5}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={900}
                      sx={{ color: plan.color }}
                    >
                      R$ {plan.price.toLocaleString("pt-BR")}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      /mês
                    </Typography>
                  </Stack>

                  <Typography color="text.secondary" variant="body2" mb={2}>
                    {plan.seats === -1
                      ? "Seats ilimitados"
                      : `${plan.seats} seat${plan.seats > 1 ? "s" : ""}`}{" "}
                    ·{" "}
                    {plan.jobs === -1
                      ? "Vagas ilimitadas"
                      : `${plan.jobs} vagas/mês`}
                  </Typography>

                  {plan.extraSeat > 0 && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mb={2}
                      display="block"
                    >
                      +R$ {plan.extraSeat}/seat extra · +R$ {plan.extraJob}/vaga
                      extra
                    </Typography>
                  )}

                  <Divider sx={{ mb: 2 }} />

                  <Stack spacing={1} flex={1}>
                    {plan.features.map((f) => (
                      <Stack
                        key={f}
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <CheckIcon
                          sx={{
                            fontSize: 16,
                            color: plan.color,
                            mt: "2px",
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontSize="0.8rem"
                        >
                          {f}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    variant={plan.highlight ? "contained" : "outlined"}
                    fullWidth
                    sx={{
                      mt: 3,
                      fontWeight: 800,
                      ...(plan.highlight
                        ? {
                            background: `linear-gradient(135deg, ${plan.color}, #009e84)`,
                          }
                        : {
                            borderColor: plan.color,
                            color: plan.color,
                            "&:hover": {
                              borderColor: plan.color,
                              bgcolor: `${plan.color}11`,
                            },
                          }),
                    }}
                    disabled={isCurrent || !isOwner}
                    onClick={() => openPayment(plan.id)}
                  >
                    {isCurrent
                      ? "Plano atual"
                      : !isOwner
                        ? "Requer permissão de dono"
                        : `Assinar ${plan.label}`}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box textAlign="center" mt={4}>
        <Typography color="text.secondary" variant="body2">
          Todos os planos incluem 14 dias grátis. Cancele quando quiser.
          Pagamento via cartão de crédito.
        </Typography>
        <Button
          variant="text"
          color="inherit"
          onClick={() => navigate("/company")}
          sx={{ mt: 1, color: "text.secondary" }}
        >
          ← Voltar para a empresa
        </Button>
      </Box>

      {/* Payment dialog */}
      <Dialog
        open={payOpen}
        onClose={() => !payLoading && setPayOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle fontWeight={800}>
          {paySuccess
            ? "✅ Pagamento aprovado!"
            : `Assinar plano ${chosenPlan?.label}`}
        </DialogTitle>
        <DialogContent>
          {paySuccess ? (
            <Stack spacing={2} py={2} alignItems="center">
              <Typography color="text.secondary" textAlign="center">
                {paySuccess}
              </Typography>
              <CircularProgress size={32} sx={{ color: "#00d3b0" }} />
            </Stack>
          ) : (
            <Stack spacing={2.5} pt={1}>
              <Alert severity="info" sx={{ fontSize: "0.8rem" }}>
                Ambiente de testes — qualquer cartão é aceito e o pagamento é
                sempre aprovado.
              </Alert>

              <Box
                sx={{
                  p: 2,
                  border: "1px solid rgba(124,77,255,0.2)",
                  borderRadius: 2,
                  bgcolor: "rgba(124,77,255,0.05)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography fontWeight={800}>
                      Workou {chosenPlan?.label} — Mensal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {chosenPlan?.seats === -1
                        ? "Ilimitado"
                        : `${chosenPlan?.seats} seat${(chosenPlan?.seats ?? 0) > 1 ? "s" : ""}`}{" "}
                      ·{" "}
                      {chosenPlan?.jobs === -1
                        ? "Vagas ilimitadas"
                        : `${chosenPlan?.jobs} vagas/mês`}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={900} color="#00d3b0">
                    R$ {chosenPlan?.price.toLocaleString("pt-BR")}
                  </Typography>
                </Stack>
              </Box>

              <TextField
                label="Número do cartão"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCard(e.target.value))}
                fullWidth
                placeholder="0000 0000 0000 0000"
                inputProps={{ maxLength: 19 }}
                autoFocus
              />
              <TextField
                label="Nome no cartão"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                fullWidth
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Validade"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  inputProps={{ maxLength: 5 }}
                  fullWidth
                />
                <TextField
                  label="CVV"
                  value={cardCvv}
                  onChange={(e) =>
                    setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  placeholder="000"
                  inputProps={{ maxLength: 4 }}
                  fullWidth
                />
              </Stack>

              {payError && <Alert severity="error">{payError}</Alert>}

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => setPayOpen(false)}
                  disabled={payLoading}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  disabled={payLoading}
                  onClick={handleSubscribe}
                  sx={{
                    background: `linear-gradient(135deg, ${chosenPlan?.color ?? "#7c4dff"}, #00d3b0)`,
                    fontWeight: 800,
                    px: 3,
                  }}
                >
                  {payLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    `Pagar R$ ${chosenPlan?.price.toLocaleString("pt-BR")}`
                  )}
                </Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
