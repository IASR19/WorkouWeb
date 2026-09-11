import SchoolIcon from '@mui/icons-material/School';
import { Box, Button, Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';

import { useTutorial } from './TutorialContext';

export function WelcomeDialog() {
  const { prompt, confirmStart, dismissPrompt } = useTutorial();

  return (
    <Dialog open={prompt.open} onClose={dismissPrompt} maxWidth="xs" fullWidth>
      <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)'
          }}
        >
          <SchoolIcon sx={{ color: '#fff' }} />
        </Box>
        <Typography variant="h6" fontWeight={800} mb={1}>
          {prompt.mode === 'auto' ? 'Bem-vindo(a) ao Workou!' : 'Refazer o tour guiado?'}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {prompt.mode === 'auto'
            ? 'Esse tour rápido só aparece no seu primeiro acesso, pra te mostrar onde tudo fica. Você pode pular a qualquer momento e refazer depois clicando em "Tutorial".'
            : 'Vamos passar de novo pelas principais telas, explicando o que cada parte faz.'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 1 }}>
        <Stack direction="row" spacing={1.5}>
          <Button onClick={dismissPrompt} color="inherit">
            Pular
          </Button>
          <Button
            onClick={confirmStart}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)', fontWeight: 800, px: 3 }}
          >
            Começar tour
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
