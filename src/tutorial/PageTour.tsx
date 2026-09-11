import { useCallback } from 'react';
import { EVENTS, Joyride, STATUS } from 'react-joyride';
import type { EventData, Step } from 'react-joyride';

import { useTutorial } from './TutorialContext';
import type { TutorialArea } from './tutorialStorage';

type PageTourProps = {
  area: TutorialArea;
  segment: number;
  steps: Step[];
  /** Route to navigate to once this segment finishes (omit to end the tour here). */
  nextRoute?: string;
};

export function PageTour({ area, segment, steps, nextRoute }: PageTourProps) {
  const { state, advanceSegment, endTour } = useTutorial();
  const shouldRun = state.running && state.activeArea === area && state.segment === segment && steps.length > 0;

  const handleEvent = useCallback((data: EventData) => {
    if (data.type !== EVENTS.TOUR_END) return;
    if (data.status === STATUS.SKIPPED) {
      endTour();
    } else if (data.status === STATUS.FINISHED) {
      if (nextRoute) advanceSegment(nextRoute);
      else endTour();
    }
  }, [advanceSegment, endTour, nextRoute]);

  if (!shouldRun) return null;

  return (
    <Joyride
      steps={steps}
      run={shouldRun}
      continuous
      onEvent={handleEvent}
      locale={{ back: 'Voltar', close: 'Fechar', last: 'Concluir', next: 'Próximo', skip: 'Pular tour' }}
      options={{
        buttons: ['back', 'skip', 'primary'],
        skipBeacon: true,
        primaryColor: '#5B3DF5',
        textColor: '#fff',
        backgroundColor: '#141E33',
        arrowColor: '#141E33',
        overlayColor: 'rgba(11,18,32,0.75)',
        spotlightPadding: 8,
        zIndex: 10000
      }}
    />
  );
}
