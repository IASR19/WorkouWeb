import type { Step } from 'react-joyride';

// As páginas garantem que esses alvos sempre existam enquanto o tour roda (injetando
// dados de exemplo quando não há vaga/candidato/match real ainda), então os steps aqui
// são fixos — sem variação condicional por estado da página.

export const RECRUITER_HOME_STEPS: Step[] = [
  {
    target: '[data-tour="job-selector"]',
    title: 'Vaga em triagem',
    content: 'Escolha aqui qual vaga você quer avaliar. Cada vaga tem sua própria fila de candidatos.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="metrics"]',
    title: 'Métricas rápidas',
    content: 'Acompanhe quantos candidatos estão na fila, quantos você já aprovou e o match do candidato atual.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="card-stack"]',
    title: 'Perfil do candidato',
    content: 'Veja o resumo do candidato aqui. Clique no card pra abrir o currículo completo.',
    placement: 'left'
  },
  {
    target: '[data-tour="swipe-actions"]',
    title: 'Aprovar ou recusar',
    content: 'Recuse com o X ou aprove com o ✓. Se aprovar e o candidato também curtir a vaga, vira match.',
    placement: 'top'
  },
  {
    target: '[data-tour="new-job-btn"]',
    title: 'Publique vagas',
    content: 'Quando quiser abrir uma nova posição pra receber candidatos, comece por aqui.',
    placement: 'bottom'
  },
  {
    target: '[data-tour="nav-matches"]',
    title: 'Seus matches',
    content: 'Clique aqui pra ver as conversas com os candidatos que deram match com você.',
    placement: 'bottom'
  }
];

export const CANDIDATE_HOME_STEPS: Step[] = [
  {
    target: '[data-tour="candidate-profile"]',
    title: 'Seu perfil',
    content: 'Aqui fica o resumo do que a IA extraiu do seu currículo. Você pode editar os dados a qualquer momento.',
    placement: 'right'
  },
  {
    target: '[data-tour="job-stack"]',
    title: 'Vagas recomendadas',
    content: 'Cada card é uma vaga com o percentual de compatibilidade calculado pra você.',
    placement: 'left'
  },
  {
    target: '[data-tour="swipe-actions"]',
    title: 'Curtir ou pular',
    content: 'Recuse com o X ou demonstre interesse com o ✓. Se o recrutador também curtir, vira match.',
    placement: 'top'
  },
  {
    target: '[data-tour="nav-matches"]',
    title: 'Seus matches',
    content: 'Clique aqui pra ver as conversas com as empresas que deram match com você.',
    placement: 'bottom'
  }
];

export const MATCHES_STEPS: Step[] = [
  {
    target: '[data-tour="conversation-list"]',
    title: 'Suas conversas',
    content: 'Toda vez que der match, a conversa aparece aqui na lista.',
    placement: 'right'
  },
  {
    target: '[data-tour="chat-area"]',
    title: 'Chat',
    content: 'Selecione uma conversa pra trocar mensagens direto com quem deu match.',
    placement: 'left'
  }
];
