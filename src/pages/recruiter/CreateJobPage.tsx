import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkIcon from '@mui/icons-material/Work';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const workModels = ['Remote', 'Hybrid', 'Onsite'];
const seniorities = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista'];

export function CreateJobPage() {
  const navigate = useNavigate();
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

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills(prev => [...prev, s]);
    }
    setSkillInput('');
  };

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createJob({
        title,
        description,
        requiredSkills: skills,
        workModel,
        location,
        seniority,
        salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax) : undefined
      });
      navigate('/recruiter');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Erro ao criar vaga. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'radial-gradient(circle at 10% 0%, rgba(124,77,255,0.22), transparent 38%), radial-gradient(circle at 95% 15%, rgba(0,211,176,0.18), transparent 32%), #061327',
        p: 3
      }}
    >
      <Box width="100%" maxWidth={600}>
        {/* Header */}
        <Stack alignItems="center" spacing={2} mb={4}>
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #7c4dff, #00d3b0)', boxShadow: '0 0 30px rgba(124,77,255,0.4)' }}>
            <BusinessCenterIcon sx={{ fontSize: 34 }} />
          </Box>
          <Box textAlign="center">
            <Typography variant="h5" fontWeight={900}>Criar sua primeira vaga</Typography>
            <Typography color="text.secondary">A IA irá estruturar os requisitos e já começar o matching.</Typography>
          </Box>
        </Stack>

        <Card sx={{ border: '1px solid rgba(124,77,255,0.2)' }}>
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
                      onChange={e => setSkillInput(e.target.value)}
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
                        <Chip key={s} label={s} onDelete={() => removeSkill(s)} size="small" sx={{ bgcolor: 'rgba(0,211,176,0.1)', color: '#00d3b0' }} />
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
                  sx={{ background: 'linear-gradient(135deg, #7c4dff, #00d3b0)', fontWeight: 800, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Publicar vaga e começar triagem'}
                </Button>

                <Button variant="text" color="inherit" onClick={() => navigate('/recruiter')} sx={{ color: 'text.secondary' }}>
                  Pular por agora
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
