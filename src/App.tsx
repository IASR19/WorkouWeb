import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell/AppShell';
import { CandidatePage } from './pages/candidate/CandidatePage';
import { OnboardingPage } from './pages/candidate/OnboardingPage';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import { PlansPage } from './pages/company/PlansPage';
import { LoginPage } from './pages/login/LoginPage';
import { MatchesPage } from './pages/matches/MatchesPage';
import { NotFoundPage } from './pages/notFound/NotFoundPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { RecruiterPage } from './pages/recruiter/RecruiterPage';
import { CreateJobPage } from './pages/recruiter/CreateJobPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recruiter/create-job" element={<CreateJobPage />} />
      <Route path="/candidate/onboarding" element={<OnboardingPage />} />
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/recruiter" replace />} />
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/candidate" element={<CandidatePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/company" element={<CompanyDashboard />} />
        <Route path="/plans" element={<PlansPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
