import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, ThemeProvider
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { WorkouLogoMark } from '../../components/WorkouLogo/WorkouLogo';
import { darkTheme } from '../../theme/theme';

const workModels = ['Remote', 'Hybrid', 'Onsite'];
const seniorities = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista'];

export function CreateJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [workModel, setWorkModel] = useState('Remote');
  const [location, setLocation] = useState('');
  const [seniority, setSeniority] = useState('Pleno');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editId) return;
    api.getJob(editId).then(job => {
      setTitle(job.title ?? '');
      setDescription(job.description ?? '');
      setSkills(job.requiredSkills ?? []);
      setWorkModel(job.workModel ?? 'Remote');
      setLocation(job.location ?? '');
      setSeniority(job.seniority ?? 'Pleno');
      setSalaryMin(job.salaryMin ? String(job.salaryMin) : '');
      setSalaryMax(job.salaryMax ? String(job.salaryMax) : '');
    }).catch(() => setError('Não foi possível carregar a vaga.'));
  }, [editId]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills(prev => [...prev, s]);
    }
    setSkillInput('');
  };

  const handleSkillInputChange = (value: string) => {
    if (!value.includes(',')) {
      setSkillInput(value);
      return;
    }
    const parts = value.split(',');
    const remainder = parts.pop() ?? '';
    const newSkills = parts.map(p => p.trim()).filter(p => p);
    if (newSkills.length) {
      setSkills(prev => [...prev, ...newSkills.filter(s => !prev.includes(s))]);
    }
    setSkillInput(remainder);
  };

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      title,
      description,
      requiredSkills: skills,
      workModel,
      location,
      seniority,
      salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
      salaryMax: salaryMax ? parseInt(salaryMax) : undefined
    };
    try {
      if (isEditing) {
        await api.updateJob(editId, payload);
      } else {
        await api.createJob(payload);
      }
      navigate('/recruiter');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao salvar vaga. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
      <Box width="100%" maxWidth={600}>
        {/* Header */}
        <Stack alignItems="center" spacing={2} mb={4}>
          <WorkouLogoMark size={64} />
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={900}>{isEditing ? 'Editar vaga' : 'Criar sua primeira vaga'}</Typography>
            <Typography color="text.secondary">A IA irá estruturar os requisitos e já começar o matching.</Typography>
          </Box>
        </Stack>

        <Card sx={{ border: '1px solid rgba(91,61,245,0.2)' }}>
          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Título da vaga"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  fullWidth
                  placeholder="ex: Desenvolvedor(a) Full Stack"
                  autoFocus
                />

                <TextField
                  label="Descrição e requisitos"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Descreva a vaga, responsabilidades e requisitos..."
                />

                {/* Skills */}
                <Box>
                  <Typography variant="body2" fontWeight={700} mb={1}>Skills Necessárias</Typography>
                  <Stack direction="row" spacing={1} mb={1}>
                    <TextField
                      size="small"
                      value={skillInput}
                      onChange={e => handleSkillInputChange(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                      placeholder="React, Node.js, Python..."
                      fullWidth
                    />
                    <Button variant="outlined" onClick={addSkill} startIcon={<AddIcon />} sx={{ flexShrink: 0 }}>
                      Add
                    </Button>
                  </Stack>
                  {skills.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {skills.map(s => (
                        <Chip key={s} label={s} onDelete={() => removeSkill(s)} size="small" sx={{ bgcolor: 'rgba(34,211,238,0.1)', color: '#22D3EE' }} />
                      ))}
                    </Stack>
                  )}
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Modelo de Trabalho</InputLabel>
                    <Select value={workModel} label="Modelo de Trabalho" onChange={e => setWorkModel(e.target.value)}>
                      {workModels.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Senioridade</InputLabel>
                    <Select value={seniority} label="Senioridade" onChange={e => setSeniority(e.target.value)}>
                      {seniorities.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>

                <TextField
                  label="Localização"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  fullWidth
                  placeholder="São Paulo, SP / Remoto / Brasil"
                />

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Salário mínimo (R$)"
                    type="number"
                    value={salaryMin}
                    onChange={e => setSalaryMin(e.target.value)}
                    fullWidth
                    placeholder="8000"
                  />
                  <TextField
                    label="Salário máximo (R$)"
                    type="number"
                    value={salaryMax}
                    onChange={e => setSalaryMax(e.target.value)}
                    fullWidth
                    placeholder="14000"
                  />
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? undefined : <WorkIcon />}
                  sx={{ background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)', fontWeight: 800, py: 1.5 }}
                >
                  {loading
                    ? <CircularProgress size={24} color="inherit" />
                    : isEditing ? 'Salvar alterações' : 'Publicar vaga e começar triagem'}
                </Button>

                <Button variant="text" color="inherit" onClick={() => navigate('/recruiter')} sx={{ color: 'text.secondary' }}>
                  {isEditing ? 'Cancelar' : 'Pular por agora'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
    </ThemeProvider>
  );
}
