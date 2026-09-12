import { Navigate } from 'react-router-dom';

import { api } from '../../services/api';

export function AppEntryPage() {
  if (!api.hasValidSession()) {
    return <Navigate to="/login" replace />;
  }

  const user = api.getCurrentUser();
  return <Navigate to={user?.role === 'recruiter' ? '/recruiter' : '/candidate'} replace />;
}
