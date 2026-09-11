export type TutorialArea = 'recruiter' | 'candidate';

function seenKey(area: TutorialArea, userId: string) {
  return `workou_tutorial_seen_${area}_${userId}`;
}

export function hasSeenTutorial(area: TutorialArea, userId: string): boolean {
  return localStorage.getItem(seenKey(area, userId)) === '1';
}

export function markTutorialSeen(area: TutorialArea, userId: string) {
  localStorage.setItem(seenKey(area, userId), '1');
}
