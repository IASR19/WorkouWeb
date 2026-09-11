import { useState, useEffect, useRef } from 'react';
import ForumIcon from '@mui/icons-material/Forum';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import { Button, Card, CardContent, Grid, Stack, TextField, Typography, List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Divider, Box } from '@mui/material';

import { api } from '../../services/api';
import { PageTour } from '../../tutorial/PageTour';
import { MATCHES_STEPS } from '../../tutorial/steps';

export function MatchesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (selectFirst = false) => {
    try {
      const convList = await api.getConversations();
      setConversations(convList);
      
      if (selectFirst && convList.length > 0) {
        setActiveConv(convList[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const msgList = await api.getMessages(convId);
      setMessages(msgList);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    fetchConversations(true);
  }, []);

  // Poll for messages in the active conversation
  useEffect(() => {
    if (!activeConv) return;
    fetchMessages(activeConv.id);
    
    const interval = setInterval(() => {
      fetchMessages(activeConv.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeConv]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !activeConv) return;
    const body = typedMessage;
    setTypedMessage('');

    try {
      const newMsg = await api.sendMessage(activeConv.id, body);
      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="grid" sx={{ placeItems: 'center', minHeight: '60vh' }}>
        <Typography variant="h5" color="text.secondary">Carregando...</Typography>
      </Box>
    );
  }

  const isRecruiter = currentUser?.role === 'recruiter';

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Seus Matches
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2}>O interesse é mútuo. A conversa começa agora.</Typography>
          </Box>
          
          <Card data-tour="conversation-list" sx={{ border: '1px solid rgba(91,61,245,0.15)' }}>
            <CardContent sx={{ p: 0 }}>
              {conversations.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {conversations.map((conv, index) => {
                    const isSelected = activeConv?.id === conv.id;
                    const candidateName = conv.match?.candidate?.user?.name || 'Candidato';
                    const jobTitle = conv.match?.job?.title || 'Vaga';
                    const companyName = conv.match?.job?.company?.name || 'Empresa';
                    const title = isRecruiter ? candidateName : `${jobTitle} (${companyName})`;
                    const subtitle = isRecruiter ? `Vaga: ${jobTitle}` : `Match de ${conv.match?.score}%`;

                    return (
                      <div key={conv.id}>
                        {index > 0 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                        <ListItem disablePadding>
                          <ListItemButton 
                            selected={isSelected} 
                            onClick={() => setActiveConv(conv)}
                            sx={{
                              py: 2,
                              '&.Mui-selected': {
                                bgcolor: 'rgba(91,61,245,0.15)',
                                borderLeft: '4px solid #5B3DF5',
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: isSelected ? 'secondary.main' : 'primary.main' }}>
                                <PersonIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={title} 
                              primaryTypographyProps={{ fontWeight: 800 }}
                              secondary={subtitle}
                            />
                          </ListItemButton>
                        </ListItem>
                      </div>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <ForumIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography fontWeight={700}>Nenhum match ainda</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>Continue dando swipes para desbloquear conexões!</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Grid>
      
      <Grid data-tour="chat-area" size={{ xs: 12, md: 8 }}>
        {activeConv ? (
          <Card 
            sx={{ 
              height: 580, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              border: '1px solid rgba(34,211,238,0.15)'
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" fontWeight={900}>
                {isRecruiter ? activeConv.match?.candidate?.user?.name : activeConv.match?.job?.company?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Vaga: {activeConv.match?.job?.title} ({activeConv.match?.score}% match)
              </Typography>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMine = msg.sender?.id === currentUser?.id;
                  return (
                    <Box 
                      key={msg.id} 
                      sx={{ 
                        alignSelf: isMine ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        bgcolor: isMine ? 'rgba(91,61,245,0.2)' : 'rgba(34,211,238,0.15)',
                        border: '1px solid',
                        borderColor: isMine ? 'rgba(91,61,245,0.3)' : 'rgba(34,211,238,0.3)',
                        borderRadius: 2,
                        p: 2
                      }}
                    >
                      <Typography variant="body1" fontWeight={700} color={isMine ? 'primary.main' : 'secondary.main'}>
                        {msg.body}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" textAlign={isMine ? 'right' : 'left'} mt={0.5}>
                        {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <Box>
                    <LockOpenIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight={800}>Chat Desbloqueado!</Typography>
                    <Typography color="text.secondary" variant="body2">Ambos curtiram o perfil. Envie a primeira mensagem para iniciar a conversa.</Typography>
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)', bgcolor: 'rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleSendMessage}>
                <Stack direction="row" spacing={2}>
                  <TextField 
                    fullWidth 
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                    placeholder="Digite uma mensagem..." 
                    variant="outlined"
                    size="medium"
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="secondary"
                    endIcon={<SendIcon />}
                    sx={{
                      background: 'linear-gradient(135deg, #5B3DF5, #22D3EE)',
                      px: 3,
                      fontWeight: 800
                    }}
                  >
                    Enviar
                  </Button>
                </Stack>
              </form>
            </Box>
          </Card>
        ) : (
          <Card sx={{ height: 580, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h5" color="text.secondary">Selecione uma conversa para começar a conversar</Typography>
            </CardContent>
          </Card>
        )}
      </Grid>

      <PageTour area="recruiter" segment={1} steps={MATCHES_STEPS} />
      <PageTour area="candidate" segment={1} steps={MATCHES_STEPS} />
    </Grid>
  );
}

