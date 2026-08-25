export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem('users')) || []; } catch { return []; }
};
export const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
export const getQuizzes = () => {
  try { return JSON.parse(localStorage.getItem('quizzes')) || []; } catch { return []; }
};
export const saveQuizzes = (quizzes) => localStorage.setItem('quizzes', JSON.stringify(quizzes));
export const getResults = () => {
  try { return JSON.parse(localStorage.getItem('results')) || []; } catch { return []; }
};
export const saveResults = (results) => localStorage.setItem('results', JSON.stringify(results));
export const getCurrentUser = () => {
  try { return JSON.parse(localStorage.getItem('currentUser')) || null; } catch { return null; }
};
export const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
export const logoutUser = () => localStorage.removeItem('currentUser');
export const getQuizProgress = () => {
  try { return JSON.parse(localStorage.getItem('quizProgress')) || {}; } catch { return {}; }
};
export const saveQuizProgress = (progress) => localStorage.setItem('quizProgress', JSON.stringify(progress));
export const clearQuizProgress = (quizId) => {
  const progress = getQuizProgress();
  if (quizId) { delete progress[quizId]; saveQuizProgress(progress); }
  else localStorage.removeItem('quizProgress');
};
export const getSettings = () => {
  try { return JSON.parse(localStorage.getItem('settings')) || { theme: 'light', notifications: true, autoSave: true }; } catch { return { theme: 'light', notifications: true, autoSave: true }; }
};
export const saveSettings = (settings) => localStorage.setItem('settings', JSON.stringify(settings));
export const getTheme = () => localStorage.getItem('theme') || 'light';
export const setTheme = (theme) => localStorage.setItem('theme', theme);
