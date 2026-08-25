import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import { seedData } from './data/defaultData';
import { getTheme } from './utils/storage';

import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import QuizList from './pages/student/QuizList';
import TakeQuiz from './pages/student/TakeQuiz';
import QuizResult from './pages/student/QuizResult';
import ResultHistory from './pages/student/ResultHistory';
import StudentProfile from './pages/student/StudentProfile';
import StudentSettings from './pages/student/StudentSettings';

import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzes from './pages/admin/ManageQuizzes';
import CreateQuiz from './pages/admin/CreateQuiz';
import ManageQuestions from './pages/admin/ManageQuestions';
import ManageStudents from './pages/admin/ManageStudents';
import ManageResults from './pages/admin/ManageResults';
import Analytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  useEffect(() => {
    seedData();
    document.documentElement.setAttribute('data-theme', getTheme());
  }, []);

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="quizzes" element={<QuizList />} />
            <Route path="quiz/:quizId" element={<TakeQuiz />} />
            <Route path="result/:resultId" element={<QuizResult />} />
            <Route path="results" element={<ResultHistory />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="quizzes" element={<ManageQuizzes />} />
            <Route path="quizzes/create" element={<CreateQuiz />} />
            <Route path="quizzes/:quizId" element={<ManageQuestions />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="results" element={<ManageResults />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
