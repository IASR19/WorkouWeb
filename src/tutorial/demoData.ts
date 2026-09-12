// Dados fictícios usados SÓ enquanto o tour guiado está rodando numa tela sem dados reais
// ainda (ex: recrutador sem vaga publicada, candidato sem match). Nunca são salvos ou
// enviados à API — servem apenas pra ter algo pra apontar o spotlight durante a demonstração.

export const DEMO_JOB = {
  id: '__demo_job__',
  title: 'Dev Frontend Pleno (exemplo)',
  status: 'open' as const,
  company: { name: 'Sua empresa' },
  requiredSkills: ['React', 'TypeScript'],
  workModel: 'Remote',
  salaryMin: 6000,
  salaryMax: 9000
};

export const DEMO_RECRUITER_MATCH = {
  id: '__demo_recruiter_match__',
  score: 92,
  candidate: {
    id: '__demo_candidate__',
    headline: 'Dev Frontend Pleno',
    yearsExperience: 4,
    desiredSalary: 8500,
    location: 'São Paulo, SP',
    workModel: 'Remote',
    skills: ['React', 'TypeScript', 'Node'],
    parsedPayload: {},
    user: { name: 'Ana Souza (exemplo)' }
  }
};

export const DEMO_CANDIDATE_MATCH = {
  id: '__demo_candidate_match__',
  score: 90,
  job: {
    id: '__demo_job__',
    title: 'Tech Lead Frontend (exemplo)',
    company: { name: 'Empresa Exemplo' },
    workModel: 'Remote',
    location: 'Remoto',
    salaryMin: 9000,
    salaryMax: 13000,
    requiredSkills: ['React', 'TypeScript', 'Liderança'],
    description: 'Vaga de exemplo só pra o tour. Quando surgirem vagas reais compatíveis, elas aparecem aqui.'
  }
};

export const DEMO_CONVERSATION = {
  id: '__demo_conversation__',
  match: {
    score: 92,
    candidate: { user: { name: 'Ana Souza (exemplo)' } },
    job: { title: 'Dev Frontend Pleno (exemplo)', company: { name: 'Sua empresa' } }
  }
};

export const DEMO_MESSAGES = [
  {
    id: '__demo_msg_1__',
    body: 'Oi! Vi que deu match, bora conversar? 👋',
    sender: { id: '__demo_other__' },
    createdAt: new Date().toISOString()
  },
  {
    id: '__demo_msg_2__',
    body: 'Bora! Fico livre à tarde.',
    sender: { id: '__demo_me__' },
    createdAt: new Date().toISOString()
  }
];
