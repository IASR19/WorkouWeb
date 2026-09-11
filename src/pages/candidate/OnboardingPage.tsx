import { useCallback, useState } from 'react';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  LinearProgress, Stack, Typography, ThemeProvider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { ResumeModal } from '../../components/ResumeModal/ResumeModal';
import { WorkouLogoMark } from '../../components/WorkouLogo/WorkouLogo';
import { darkTheme } from '../../theme/theme';

type Step = 'upload' | 'analyzing' | 'preview';

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const processFile = async (f: File) => {
    setFile(f);
    setError('');
    setStep('analyzing');
    try {
      const result = await api.uploadResume(f);
      setParsedData(result.parsedData);
      setCandidate(result.candidate);
      setStep('preview');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao analisar currículo. Tente novamente.');
      setStep('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
  }, []);

  const handleConfirm = () => navigate('/candidate');

  return (
    <ThemeProvider theme={darkTheme}>
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        bgcolor: '#0B1220',
        p: 3
      }}
    >
      <Box width="100%" maxWidth={560}>
        {/* Logo */}
        <Stack alignItems="center" spacing={2} mb={4}>
          <WorkouLogoMark size={60} />
          <Typography variant="h5" fontWeight={900} textAlign="center">
            {step === 'upload' && 'Envie seu currículo'}
            {step === 'analyzing' && 'IA analisando...'}
            {step === 'preview' && 'Perfil extraído com sucesso!'}
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            {step === 'upload' && 'Nossa IA extrai tudo automaticamente do PDF.'}
            {step === 'analyzing' && 'Estamos lendo o seu currículo e extraindo suas competências.'}
            {step === 'preview' && 'Confirme seu perfil e comece a receber vagas recomendadas.'}
          </Typography>
        </Stack>

        {step === 'upload' && (
          <Card sx={{ border: '1px solid rgba(34,211,238,0.2)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                sx={{
                  border: `2px dashed ${dragging ? '#22D3EE' : 'rgba(34,211,238,0.3)'}`,
                  borderRadius: 3,
                  p: 6,
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  bgcolor: dragging ? 'rgba(34,211,238,0.05)' : 'transparent',
                  cursor: 'pointer'
                }}
                onClick={() => document.getElementById('resume-input')?.click()}
              >
                <UploadFileIcon sx={{ fontSize: 56, color: dragging ? '#22D3EE' : 'text.secondary', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} mb={1}>
                  Arraste seu currículo aqui
                </Typography>
                <Typography color="text.secondary" mb={3}>ou clique para selecionar um arquivo PDF</Typography>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)', fontWeight: 800 }}
                  onClick={e => e.stopPropagation()}
                >
                  Selecionar PDF
                  <input id="resume-input" type="file" accept=".pdf" hidden onChange={handleFileChange} />
                </Button>
              </Box>

              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              <Typography textAlign="center" mt={3} color="text.secondary" variant="body2">
                <Button variant="text" size="small" color="secondary" onClick={handleConfirm} sx={{ fontWeight: 700 }}>
                  Pular por agora
                </Button>
              </Typography>
            </CardContent>
          </Card>
        )}

        {step === 'analyzing' && (
          <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                <CircularProgress size={96} sx={{ color: '#5B3DF5' }} />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AutoAwesomeIcon sx={{ fontSize: 36, color: '#22D3EE' }} />
                </Box>
              </Box>
              <Typography variant="h6" fontWeight={800} mb={1}>IA analisando seu currículo</Typography>
              <Typography color="text.secondary" mb={3}>{file?.name}</Typography>
              <LinearProgress sx={{ borderRadius: 4, height: 6, bgcolor: 'rgba(91,61,245,0.2)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #5B3DF5, #22D3EE)' } }} />
              <Stack spacing={1} mt={3}>
                {['Extraindo texto do PDF...', 'Identificando competências...', 'Gerando perfil padronizado...'].map(t => (
                  <Typography key={t} variant="body2" color="text.secondary">{t}</Typography>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {step === 'preview' && parsedData && candidate && (
          <Card sx={{ border: '1px solid rgba(34,211,238,0.3)' }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                <CheckCircleIcon color="success" sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight={800}>Perfil criado com sucesso!</Typography>
              </Stack>

              <Stack spacing={1.5} mb={3}>
                <Typography fontWeight={700} variant="h6">{candidate.user?.name}</Typography>
                <Typography color="secondary" fontWeight={700}>{parsedData.headline}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {parsedData.location} · {parsedData.workModel} · {parsedData.yearsExperience} anos de experiência
                </Typography>
                {parsedData.desiredSalary && (
                  <Typography color="text.secondary" variant="body2">
                    Pretensão: R$ {parsedData.desiredSalary.toLocaleString('pt-BR')}
                  </Typography>
                )}
                {parsedData.skills?.length > 0 && (
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mt={1}>
                    {parsedData.skills.slice(0, 8).map((s: string) => (
                      <Chip key={s} label={s} size="small" sx={{ bgcolor: 'rgba(34,211,238,0.1)', color: '#22D3EE' }} />
                    ))}
                  </Stack>
                )}
              </Stack>

              <Button
                variant="text"
                color="secondary"
                size="small"
                onClick={() => setPreviewOpen(true)}
                sx={{ mb: 2 }}
              >
                Ver currículo completo
              </Button>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleConfirm}
                sx={{ background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)', fontWeight: 800, py: 1.5 }}
              >
                Confirmar e buscar vagas
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {parsedData && candidate && (
        <ResumeModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          candidate={candidate}
          parsedPayload={parsedData}
        />
      )}
    </Box>
    </ThemeProvider>
  );
}
