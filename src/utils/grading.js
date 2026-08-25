export const getGrade = (p) => {
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B+';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C';
  return 'F';
};
export const getStatus = (p, pass) => p >= pass ? 'PASSED' : 'FAILED';
