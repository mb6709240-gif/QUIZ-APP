const toDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const getOpenDate = (quiz) => {
  if (quiz?.openDate && quiz?.openTime) return toDate(`${quiz.openDate}T${quiz.openTime}`);
  return toDate(quiz?.scheduledAt);
};

export const getCloseDate = (quiz) => {
  if (quiz?.closeDate && quiz?.closeTime) return toDate(`${quiz.closeDate}T${quiz.closeTime}`);
  const openDate = getOpenDate(quiz);
  return openDate && quiz?.duration ? new Date(openDate.getTime() + Number(quiz.duration) * 60000) : null;
};

export const getQuizStatus = (quiz, now = new Date()) => {
  if (!quiz?.published) return 'DRAFT';
  const openDate = getOpenDate(quiz);
  const closeDate = getCloseDate(quiz);
  if (!openDate && !closeDate) return 'LIVE';
  if (openDate && now < openDate) return 'UPCOMING';
  if (closeDate && now > closeDate) return 'COMPLETED';
  return 'LIVE';
};

export const isQuizUpcoming = (quiz, now) => getQuizStatus(quiz, now) === 'UPCOMING';
export const isQuizLive = (quiz, now) => getQuizStatus(quiz, now) === 'LIVE';
export const isQuizCompleted = (quiz, now) => getQuizStatus(quiz, now) === 'COMPLETED';

export const getTimeUntilOpen = (quiz, now = new Date()) => {
  const openDate = getOpenDate(quiz);
  return openDate ? Math.max(0, openDate.getTime() - now.getTime()) : 0;
};

export const getTimeUntilClose = (quiz, now = new Date()) => {
  const closeDate = getCloseDate(quiz);
  return closeDate ? Math.max(0, closeDate.getTime() - now.getTime()) : 0;
};

export const canStartQuiz = (quiz, now) => isQuizLive(quiz, now) && (quiz?.questions?.length || 0) > 0;

export const formatDuration = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${String(hours).padStart(2, '0')}h`;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};