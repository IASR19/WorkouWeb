import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import InstallMobileIcon from '@mui/icons-material/InstallMobile';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Box, Button, IconButton, Paper, Stack, Typography } from '@mui/material';

const DISMISS_KEY = 'workou:install-prompt-dismissed-at';
const DISMISS_DAYS = 14;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function wasRecentlyDismissed() {
  const raw = localStorage.getItem(DISMISS_KEY);
  if (!raw) return false;
  const dismissedAt = Number(raw);
  const days = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
  return days < DISMISS_DAYS;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const visible = !dismissed && (Boolean(deferredPrompt) || showIosHint);

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setDismissed(true);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    handleDismiss();
  }

  if (!visible) return null;

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        left: { xs: 12, sm: 'auto' },
        right: { xs: 12, sm: 24 },
        bottom: { xs: 12, sm: 24 },
        zIndex: (theme) => theme.zIndex.snackbar,
        maxWidth: 400,
        p: 2,
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.10)',
        background: 'rgba(13, 28, 51, 0.95)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start">
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)'
          }}
        >
          <InstallMobileIcon sx={{ color: '#fff' }} fontSize="small" />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={800}>
            Instale o Workou
          </Typography>
          {showIosHint ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Toque em Compartilhar <IosShareIcon sx={{ fontSize: 14, verticalAlign: 'text-bottom' }} /> e depois em
              "Adicionar à Tela de Início" para usar o app direto do seu celular.
            </Typography>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1.5 }}>
                Adicione o Workou à tela inicial do seu celular para acesso rápido, como um app.
              </Typography>
              <Button variant="contained" size="small" onClick={handleInstall}>
                Instalar
              </Button>
            </>
          )}
        </Box>
        <IconButton size="small" onClick={handleDismiss} sx={{ mt: -0.5, mr: -0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}
