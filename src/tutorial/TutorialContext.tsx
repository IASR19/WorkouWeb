import { createContext, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';
import { hasSeenTutorial, markTutorialSeen } from './tutorialStorage';
import type { TutorialArea } from './tutorialStorage';
import { WelcomeDialog } from './WelcomeDialog';

type TourState = {
  activeArea: TutorialArea | null;
  segment: number;
  running: boolean;
};

type PromptState = {
  open: boolean;
  area: TutorialArea | null;
  mode: 'auto' | 'manual';
};

type TutorialContextValue = {
  state: TourState;
  prompt: PromptState;
  requestAutoStart: (area: TutorialArea) => void;
  startManually: (area: TutorialArea) => void;
  confirmStart: () => void;
  dismissPrompt: () => void;
  advanceSegment: (nextRoute?: string) => void;
  endTour: () => void;
};

const TutorialCtx = createContext<TutorialContextValue | null>(null);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<TourState>({ activeArea: null, segment: 0, running: false });
  const [prompt, setPrompt] = useState<PromptState>({ open: false, area: null, mode: 'auto' });
  const autoRequestedRef = useRef<Set<TutorialArea>>(new Set());

  const value = useMemo<TutorialContextValue>(() => ({
    state,
    prompt,

    requestAutoStart(area) {
      const user = api.getCurrentUser();
      if (!user) return;
      if (hasSeenTutorial(area, user.id)) return;
      if (autoRequestedRef.current.has(area)) return;
      if (state.activeArea || prompt.open) return;
      autoRequestedRef.current.add(area);
      setPrompt({ open: true, area, mode: 'auto' });
    },

    startManually(area) {
      setPrompt({ open: true, area, mode: 'manual' });
    },

    confirmStart() {
      if (!prompt.area) return;
      // A manual replay can be triggered from any page under AppShell (Matches, Company,
      // Profile...) — always jump back to the area's home page so segment 0's steps exist.
      if (prompt.mode === 'manual') {
        navigate(prompt.area === 'recruiter' ? '/recruiter' : '/candidate');
      }
      setState({ activeArea: prompt.area, segment: 0, running: true });
      setPrompt({ open: false, area: null, mode: 'auto' });
    },

    dismissPrompt() {
      const user = api.getCurrentUser();
      if (prompt.mode === 'auto' && prompt.area && user) {
        markTutorialSeen(prompt.area, user.id);
      }
      setPrompt({ open: false, area: null, mode: 'auto' });
    },

    advanceSegment(nextRoute) {
      setState((s) => ({ ...s, segment: s.segment + 1, running: true }));
      if (nextRoute) navigate(nextRoute);
    },

    endTour() {
      const user = api.getCurrentUser();
      if (state.activeArea && user) {
        markTutorialSeen(state.activeArea, user.id);
      }
      setState({ activeArea: null, segment: 0, running: false });
    }
  }), [state, prompt, navigate]);

  return (
    <TutorialCtx.Provider value={value}>
      {children}
      <WelcomeDialog />
    </TutorialCtx.Provider>
  );
}

export function useTutorial() {
  const ctx = useContext(TutorialCtx);
  if (!ctx) throw new Error('useTutorial must be used within a TutorialProvider');
  return ctx;
}
