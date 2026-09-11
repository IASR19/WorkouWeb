import { useEffect, useRef, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, CardContent, Divider,
  Grid, IconButton, Stack, TextField, Typography
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { api } from '../../services/api';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AvatarUpload({ value, onChange, label }: { value?: string; onChange: (dataUrl: string) => void; label: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Imagem muito grande. Máximo de 2MB.');
      return;
    }
    setError('');
    onChange(await readFileAsDataUrl(file));
  };

  return (
    <Stack alignItems="center" spacing={1}>
      <Box sx={{ position: 'relative' }}>
        <Avatar src={value} sx={{ width: 96, height: 96, fontSize: '2rem', bgcolor: 'primary.main' }}>
          {label[0]?.toUpperCase()}
        </Avatar>
        <IconButton
          size="small"
          onClick={() => inputRef.current?.click()}
          sx={{
            position: 'absolute', bottom: 0, right: 0,
            bgcolor: 'secondary.main', color: '#fff',
            '&:hover': { bgcolor: 'secondary.dark' }
          }}
        >
          <PhotoCameraIcon fontSize="small" />
        </IconButton>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={e => handleFile(e.target.files?.[0])}
        />
      </Box>
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Stack>
  );
}

export function ProfilePage() {
  const currentUser = api.getCurrentUser();
  const isRecruiter = currentUser?.role === 'recruiter';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | undefined>(undefined);
  const [companyMsg, setCompanyMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  useEffect(() => {
    api.getMe().then(me => {
      setName(me.name ?? '');
      setEmail(me.email ?? '');
      setAvatar(me.avatar ?? undefined);
    });
    if (isRecruiter) {
      api.getMyCompany().then(company => {
        setCompanyName(company.name ?? '');
        setCompanyWebsite(company.website ?? '');
        setCompanyIndustry(company.industry ?? '');
        setCompanyLogo(company.logo ?? undefined);
      }).catch(() => {});
    }
  }, [isRecruiter]);

  const handleSaveProfile = async () => {
    setProfileMsg(null);
    if (newPassword && newPassword.length < 8) {
      setProfileMsg({ type: 'error', text: 'A nova senha precisa ter pelo menos 8 caracteres.' });
      return;
    }
    setProfileLoading(true);
    try {
      await api.updateMe({
        name,
        email,
        avatar,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      });
      setCurrentPassword('');
      setNewPassword('');
      setProfileMsg({ type: 'success', text: 'Perfil atualizado com sucesso.' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.response?.data?.message ?? 'Erro ao atualizar perfil.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    setCompanyMsg(null);
    setCompanyLoading(true);
    try {
      await api.updateMyCompany({
        name: companyName,
        website: companyWebsite,
        industry: companyIndustry,
        logo: companyLogo,
      });
      setCompanyMsg({ type: 'success', text: 'Empresa atualizada com sucesso.' });
    } catch (err: any) {
      setCompanyMsg({ type: 'error', text: err?.response?.data?.message ?? 'Erro ao atualizar empresa.' });
    } finally {
      setCompanyLoading(false);
    }
  };

  return (
    <Box maxWidth={720} mx="auto">
      <Typography variant="h4" fontWeight={900} mb={3}>Meu perfil</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <AvatarUpload value={avatar} onChange={setAvatar} label={name || 'U'} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Nome" value={name} onChange={e => setName(e.target.value)} fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="E-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
              </Grid>
            </Grid>

            <Divider />

            <Typography variant="subtitle2" fontWeight={800} color="text.secondary">
              Trocar senha (opcional)
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Senha atual"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  fullWidth
                  autoComplete="current-password"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  fullWidth
                  helperText="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>

            {profileMsg && <Alert severity={profileMsg.type}>{profileMsg.text}</Alert>}

            <Button
              variant="contained"
              onClick={handleSaveProfile}
              disabled={profileLoading}
              sx={{ alignSelf: 'flex-start' }}
            >
              Salvar perfil
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {isRecruiter && (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={800} mb={3}>Empresa</Typography>
            <Stack spacing={3}>
              <AvatarUpload value={companyLogo} onChange={setCompanyLogo} label={companyName || 'E'} />

              <TextField label="Nome da empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} fullWidth />
              <TextField label="Website" value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} fullWidth placeholder="https://suaempresa.com.br" />
              <TextField label="Setor / Indústria" value={companyIndustry} onChange={e => setCompanyIndustry(e.target.value)} fullWidth />

              {companyMsg && <Alert severity={companyMsg.type}>{companyMsg.text}</Alert>}

              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveCompany}
                disabled={companyLoading}
                sx={{ alignSelf: 'flex-start' }}
              >
                Salvar empresa
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
