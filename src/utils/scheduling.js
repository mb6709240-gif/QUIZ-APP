export function getQuizStatus(quiz) {
  // return 'Draft' | 'Upcoming' | 'Live' | 'Completed'
  if (!quiz) return 'Unknown';
  if (!quiz.published) return 'Draft';
  if (!quiz.scheduledEnabled) return 'Live'; // published without schedule -> always live
  const now = Date.now();
  const start = quiz.scheduledAt ? new Date(quiz.scheduledAt).getTime() : null;
  const end = quiz.scheduledEnd ? new Date(quiz.scheduledEnd).getTime() : null;
  if (start && now < start) return 'Upcoming';
  if (end && now > end) return 'Completed';
  return 'Live';
}

export function getMillisUntilStart(quiz) {
  if (!quiz || !quiz.scheduledEnabled || !quiz.scheduledAt) return 0;
  return Math.max(new Date(quiz.scheduledAt).getTime() - Date.now(), 0);
}

export function getMillisUntilEnd(quiz) {
  if (!quiz || !quiz.scheduledEnabled || !quiz.scheduledEnd) return 0;
  return Math.max(new Date(quiz.scheduledEnd).getTime() - Date.now(), 0);
}
