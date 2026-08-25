import { getGrade, getStatus } from './grading';

export const evaluateQuiz = (quiz, answers) => {
  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  let correct = 0, wrong = 0, unanswered = 0, obtainedMarks = 0, totalMarks = 0;

  questions.forEach((q) => {
    totalMarks += q.marks || 2;
    const ua = answers[q.id];
    if (!ua) unanswered++;
    else if (ua === q.correctAnswer) { correct++; obtainedMarks += q.marks || 2; }
    else wrong++;
  });

  const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
  return {
    totalQuestions, correct, wrong, unanswered, totalMarks, obtainedMarks,
    percentage, grade: getGrade(percentage), status: getStatus(percentage, quiz.passingPercentage || 50),
  };
};
