import CheckIcon from '@mui/icons-material/Check';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import ForumIcon from '@mui/icons-material/Forum';
import { Box, Button, Modal, Typography, Fade, Backdrop } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface DeuMatchModalProps {
  open: boolean;
  onClose: () => void;
  candidateName?: string;
  jobTitle?: string;
}

export function DeuMatchModal({ open, onClose, candidateName, jobTitle }: DeuMatchModalProps) {
  const navigate = useNavigate();

  const handleGoToChat = () => {
    onClose();
    navigate('/matches');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400, sx: { bgcolor: 'rgba(6,19,39,0.92)', backdropFilter: 'blur(12px)' } } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 320, sm: 440 },
            textAlign: 'center',
            outline: 'none',
            px: 3,
            py: 5
          }}
        >
          {/* Overlapping circles */}
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4, height: 120 }}>
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-80px)',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c4dff, #5b2de8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(124,77,255,0.6)',
                animation: 'slideInLeft 0.5s ease-out'
              }}
            >
              <PersonIcon sx={{ fontSize: 48, color: '#fff' }} />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-16px)',
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00d3b0, #009e84)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 30px rgba(0,211,176,0.6)',
                animation: 'slideInRight 0.5s ease-out'
              }}
            >
              <BusinessIcon sx={{ fontSize: 48, color: '#fff' }} />
            </Box>
            {/* Checkmark overlap */}
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-28px)',
                top: '50%',
                marginTop: '-20px',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: '0 0 20px rgba(16,217,155,0.8)'
              }}
            >
              <CheckIcon sx={{ color: '#10d99b', fontSize: 28, fontWeight: 900 }} />
            </Box>
          </Box>

          <Typography variant="h3" fontWeight={900} sx={{ background: 'linear-gradient(90deg, #7c4dff, #00d3b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
            Deu Match!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={1}>
            O interesse é mútuo. A conversa começa agora.
          </Typography>
          {(candidateName || jobTitle) && (
            <Typography variant="body2" color="text.secondary" mb={3}>
              {candidateName && <><strong style={{ color: '#00d3b0' }}>{candidateName}</strong>{' '}</>}
              {jobTitle && <>e <strong style={{ color: '#7c4dff' }}>{jobTitle}</strong></>}
            </Typography>
          )}

          {/* Chat badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 3,
              py: 1.5,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(124,77,255,0.2), rgba(0,211,176,0.2))',
              border: '1px solid rgba(0,211,176,0.4)',
              mb: 4
            }}
          >
            <ForumIcon sx={{ color: '#00d3b0' }} />
            <Box textAlign="left">
              <Typography variant="subtitle2" fontWeight={800} color="#fff">Chat Liberado!</Typography>
              <Typography variant="caption" color="text.secondary">O canal está aberto. Converse agora mesmo!</Typography>
            </Box>
          </Box>

          <Box display="flex" gap={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={handleGoToChat}
              startIcon={<ForumIcon />}
              sx={{
                background: 'linear-gradient(135deg, #7c4dff, #00d3b0)',
                fontWeight: 800,
                px: 4,
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Ver Conversa
            </Button>
            <Button variant="outlined" size="large" onClick={onClose} sx={{ fontWeight: 700, px: 3 }}>
              Continuar
            </Button>
          </Box>

          <style>{`
            @keyframes slideInLeft { from { transform: translateX(-120px); opacity: 0; } to { transform: translateX(-80px); opacity: 1; } }
            @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(-16px); opacity: 1; } }
          `}</style>
        </Box>
      </Fade>
    </Modal>
  );
}
