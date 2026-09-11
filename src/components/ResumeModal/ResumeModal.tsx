import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { Avatar, Backdrop, Box, Chip, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, ThemeProvider, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { darkTheme } from '../../theme/theme';

interface Experience {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface Education {
  degree: string;
  institution: string;
  startYear: string;
  endYear: string;
}

interface Course {
  name: string;
  institution: string;
  year: string;
}

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
  candidate: {
    user?: { name?: string; avatar?: string };
    headline?: string;
    location?: string;
    workModel?: string;
    yearsExperience?: number;
    desiredSalary?: number;
    skills?: string[];
    links?: string[];
  };
  matchScore?: number;
  parsedPayload?: {
    experience?: Experience[];
    education?: Education[];
    courses?: Course[];
  };
}

function getInitials(name?: string) {
  if (!name) return 'P';
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

export function ResumeModal({ open, onClose, candidate, matchScore, parsedPayload }: ResumeModalProps) {
  const name = candidate.user?.name;
  const avatar = candidate.user?.avatar;
  const initials = getInitials(name);
  const [zoomOpen, setZoomOpen] = useState(false);

  const experience = parsedPayload?.experience ?? [];
  const education = parsedPayload?.education ?? [];
  const courses = parsedPayload?.courses ?? [];

  const emailLink = candidate.links?.find(l => l.includes('@'));
  const linkedinLink = candidate.links?.find(l => l.includes('linkedin'));

  return (
    <ThemeProvider theme={darkTheme}>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { background: 'rgba(6,19,39,0.97)', border: '1px solid rgba(34,211,238,0.2)', color: '#fff' } }}>
      <DialogTitle sx={{ p: 0 }}>
        <Box
          sx={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(91,61,245,0.15), rgba(34,211,238,0.10))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            p: { xs: 2, sm: 3 },
            pr: { xs: 6, sm: 7 },
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: { xs: 2, sm: 3 }
          }}
        >
          {/* Avatar */}
          <Box
            sx={{ position: 'relative', flexShrink: 0, cursor: avatar ? 'pointer' : 'default' }}
            onClick={() => avatar && setZoomOpen(true)}
          >
            <Avatar
              src={avatar}
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                bgcolor: '#5B3DF5',
                fontSize: '1.6rem',
                fontWeight: 900,
                border: '3px solid #22D3EE'
              }}
            >
              {initials}
            </Avatar>
            {avatar && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(0,0,0,0.4)',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                  '&:hover': { opacity: 1 }
                }}
              >
                <ZoomInIcon sx={{ color: '#fff' }} />
              </Box>
            )}
          </Box>

          {/* Name + details */}
          <Box flex={1}>
            <Typography variant="h5" fontWeight={900} color="#fff">{name || 'Candidato'}</Typography>
            <Typography color="secondary" fontWeight={700} mb={1}>{candidate.headline}</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {candidate.location && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{candidate.location}</Typography>
                </Stack>
              )}
              {candidate.workModel && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <WorkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{candidate.workModel}</Typography>
                </Stack>
              )}
              {emailLink && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{emailLink}</Typography>
                </Stack>
              )}
              {linkedinLink && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LinkedInIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{linkedinLink}</Typography>
                </Stack>
              )}
            </Stack>
          </Box>

          {/* Badges */}
          <Box textAlign="right" flexShrink={0}>
            {matchScore && (
              <Chip
                icon={<StarIcon />}
                label={`${matchScore}% match`}
                color="success"
                sx={{ fontWeight: 900, mb: 1, display: 'flex' }}
              />
            )}
            {candidate.yearsExperience !== undefined && (
              <Chip
                label={`${candidate.yearsExperience}+ anos`}
                variant="outlined"
                size="small"
                sx={{ mb: 0.5, display: 'flex', color: 'text.secondary' }}
              />
            )}
            <Chip
              icon={<CheckCircleIcon />}
              label="Disponível"
              size="small"
              color="secondary"
              sx={{ display: 'flex' }}
            />
          </Box>

          <IconButton onClick={onClose} sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={800} mb={1.5}>Skills</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {candidate.skills.map(skill => (
                <Chip key={skill} label={skill} size="small" sx={{ bgcolor: 'rgba(34,211,238,0.12)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.2)' }} />
              ))}
            </Stack>
          </Box>
        )}

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 3 }} />

        {/* Experience */}
        {experience.length > 0 && (
          <Box mb={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <WorkIcon color="secondary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={800}>Experiência</Typography>
            </Stack>
            <Stack spacing={2}>
              {experience.map((exp, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22D3EE', flexShrink: 0 }} />
                    {idx < experience.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: 'rgba(34,211,238,0.2)', mt: 0.5 }} />}
                  </Box>
                  <Box flex={1} pb={idx < experience.length - 1 ? 2 : 0}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography fontWeight={700}>{exp.role}</Typography>
                        <Typography variant="body2" color="secondary">{exp.company}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                        {exp.startDate} – {exp.endDate}
                      </Typography>
                    </Stack>
                    {exp.description && (
                      <Typography variant="body2" color="text.secondary" mt={0.5}>{exp.description}</Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Box mb={3}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <SchoolIcon color="secondary" fontSize="small" />
              <Typography variant="subtitle1" fontWeight={800}>Formação</Typography>
            </Stack>
            <Stack spacing={1.5}>
              {education.map((edu, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={700}>{edu.degree}</Typography>
                    <Typography variant="body2" color="secondary">{edu.institution}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {edu.startYear} – {edu.endYear}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2 }} />
            <Typography variant="subtitle1" fontWeight={800} mb={1.5}>Cursos</Typography>
            <Stack spacing={1}>
              {courses.map((course, idx) => (
                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" fontWeight={700}>{course.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{course.institution}</Typography>
                  </Box>
                  <Chip label={course.year} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />
                </Stack>
              ))}
            </Stack>
          </Box>
        )}

        {experience.length === 0 && education.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Currículo ainda não foi carregado pela IA. Aguarde o candidato enviar o PDF.
          </Typography>
        )}
      </DialogContent>
    </Dialog>

    {avatar && (
      <Backdrop
        open={zoomOpen}
        onClick={() => setZoomOpen(false)}
        sx={{ zIndex: theme => theme.zIndex.modal + 1, bgcolor: 'rgba(6,19,39,0.92)', cursor: 'zoom-out' }}
      >
        <Box
          component="img"
          src={avatar}
          alt={name || 'Foto do candidato'}
          sx={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 2, boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}
        />
      </Backdrop>
    )}
    </ThemeProvider>
  );
}
