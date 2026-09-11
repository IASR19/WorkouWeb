import { useEffect, useState } from "react";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ForumIcon from "@mui/icons-material/Forum";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { WorkouWordmark } from "../WorkouLogo/WorkouLogo";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppTheme } from "../../context/ThemeContext";
import { api } from "../../services/api";
import { useTutorial } from "../../tutorial/TutorialContext";

const RECRUITER_NAV = [
  { label: "Candidatos", path: "/recruiter", icon: <PersonSearchIcon /> },
  { label: "Matches", path: "/matches", icon: <ForumIcon />, tour: "nav-matches" },
  { label: "Minha Empresa", path: "/company", icon: <CorporateFareIcon /> },
];

const CANDIDATE_NAV = [
  { label: "Vagas", path: "/candidate", icon: <BusinessCenterIcon /> },
  { label: "Matches", path: "/matches", icon: <ForumIcon />, tour: "nav-matches" },
];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useAppTheme();
  const { startManually } = useTutorial();
  const [authorized, setAuthorized] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [newMatchCount, setNewMatchCount] = useState(0);

  useEffect(() => {
    if (!api.hasValidSession()) {
      navigate("/login");
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  useEffect(() => {
    const currentUser = api.getCurrentUser();
    if (currentUser?.role === "recruiter") {
      api.getMyCompany().then(setCompany).catch(console.error);
    }
  }, []);

  const seenMatchesKey = `workou_seen_matches_count_${api.getCurrentUser()?.id ?? "anon"}`;

  useEffect(() => {
    const checkNewMatches = async () => {
      try {
        const conversations = await api.getConversations();
        const seen = Number(localStorage.getItem(seenMatchesKey) ?? 0);
        setNewMatchCount(Math.max(0, conversations.length - seen));
      } catch {
        // silently ignore — badge is a nice-to-have, not critical
      }
    };
    checkNewMatches();
    const interval = setInterval(checkNewMatches, 15000);
    return () => clearInterval(interval);
  }, [seenMatchesKey]);

  useEffect(() => {
    if (location.pathname === "/matches" && newMatchCount > 0) {
      api.getConversations().then(conversations => {
        localStorage.setItem(seenMatchesKey, String(conversations.length));
        setNewMatchCount(0);
      }).catch(() => {});
    }
  }, [location.pathname, newMatchCount]);

  const handleLogout = () => {
    api.logout();
    navigate("/login");
  };

  if (!authorized) return null;

  const isDark = mode === "dark";
  const currentUser = api.getCurrentUser();
  const role = currentUser?.role;
  const availableRoles = currentUser?.availableRoles ?? [role];
  const hasMultipleRoles = availableRoles.length > 1;

  const navItems = role === "recruiter" ? RECRUITER_NAV : CANDIDATE_NAV;

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: isDark
          ? "radial-gradient(circle at 10% 0%, rgba(91,61,245,0.22), transparent 38%), radial-gradient(circle at 95% 15%, rgba(34,211,238,0.18), transparent 32%), #0B1220"
          : "radial-gradient(circle at 10% 0%, rgba(91,61,245,0.10), transparent 38%), radial-gradient(circle at 95% 15%, rgba(34,211,238,0.08), transparent 32%), #F7F8FC",
      }}
    >
      <Box
        component="header"
        sx={{
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(91,61,245,0.12)"}`,
          bgcolor: isDark ? "rgba(6,19,39,0.8)" : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            rowGap={1}
            py={1.5}
          >
            {/* Logo + role badge */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <WorkouWordmark size="sm" dark={!isDark} />
              <Box sx={{ width: "1px", height: 20, bgcolor: "divider", display: { xs: "none", sm: "block" } }} />
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ display: { xs: "none", sm: "flex" } }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: role === "recruiter" ? "#9B8AFB" : "#22D3EE",
                  }}
                />
                <Typography
                  variant="caption"
                  fontWeight={800}
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color="text.secondary"
                >
                  {role === "recruiter" ? "Recrutador" : "Candidato"}
                </Typography>
              </Stack>
              {role === "recruiter" && company && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ ml: 1, display: { xs: "none", md: "flex" } }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {company.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ opacity: 0.6 }}
                  >
                    • CNPJ {company.document}
                  </Typography>
                </Stack>
              )}
            </Stack>

            {/* Nav */}
            <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  data-tour={item.tour}
                  startIcon={
                    item.path === "/matches" && newMatchCount > 0 ? (
                      <Badge badgeContent={newMatchCount} color="secondary">
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )
                  }
                  size="small"
                  disableRipple
                  sx={{
                    color: "text.secondary",
                    fontWeight: 700,
                    borderRadius: 0,
                    px: { xs: 1, sm: 1.5 },
                    py: 0.75,
                    minWidth: 0,
                    borderBottom: "2px solid transparent",
                    "&.active": {
                      color: isDark ? "#fff" : "text.primary",
                      borderBottomColor: "#22D3EE",
                    },
                    "&:hover": { color: isDark ? "#fff" : "text.primary" },
                    "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } },
                  }}
                >
                  <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                    {item.label}
                  </Box>
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
                      navigate("/login");
                    }}
                    sx={{
                      color: "text.secondary",
                      fontWeight: 700,
                      borderRadius: 2,
                      minWidth: 0,
                      px: { xs: 1, sm: 1.5 },
                      "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } },
                      "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                      Trocar perfil
                    </Box>
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="Refazer o tutorial guiado">
                <IconButton
                  onClick={() => role && startManually(role as "recruiter" | "candidate")}
                  size="small"
                  sx={{ mx: 0.5, color: "text.secondary" }}
                >
                  <SchoolIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Meu perfil">
                <IconButton onClick={() => navigate("/profile")} size="small" sx={{ mx: 0.5 }}>
                  <Avatar src={currentUser?.avatar} sx={{ width: 28, height: 28, fontSize: "0.85rem", bgcolor: "primary.main" }}>
                    {currentUser?.name?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Tooltip title={isDark ? "Modo Claro" : "Modo Escuro"}>
                <IconButton
                  onClick={toggleMode}
                  size="small"
                  sx={{ mx: 0.5, color: "text.secondary" }}
                >
                  {isDark ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>

              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                size="small"
                color="error"
                sx={{
                  fontWeight: 700,
                  borderRadius: 2,
                  minWidth: 0,
                  px: { xs: 1, sm: 1.5 },
                  "& .MuiButton-startIcon": { mr: { xs: 0, sm: 1 } },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Sair
                </Box>
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
