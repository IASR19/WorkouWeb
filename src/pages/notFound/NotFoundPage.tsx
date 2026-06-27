import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Stack spacing={2}>
        <Typography variant="h2">Pagina nao encontrada</Typography>
        <Button component={RouterLink} to="/recruiter" variant="contained">Voltar</Button>
      </Stack>
    </Container>
  );
}

