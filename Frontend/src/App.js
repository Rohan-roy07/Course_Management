import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import CourseList from './components/CourseList';
import CourseForm from './components/CourseForm';
import Dashboard from './components/Dashboard';
import NavigationBar from './components/NavigationBar';
import { AuthProvider, AuthContext } from './AuthContext';
import AdminPanel from './components/AdminPanel';
import TeacherPanel from './components/TeacherPanel';
import TeacherCourses from './components/TeacherCourses';
import TeacherLessons from './components/TeacherLessons';
import TeacherAssessments from './components/TeacherAssessments';
import TeacherGrades from './components/TeacherGrades';
import StudentCourses from './components/StudentCourses';
import StudentGrades from './components/StudentGrades';
import StudentLessons from './components/StudentLessons';
import StudentAssessments from './components/StudentAssessments';


function AppContent() {
  const { role, isAuthenticated, isLoading } = useContext(AuthContext);
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses"
          element={isAuthenticated ? <CourseList /> : <Navigate to="/login" />}
        />

        <Route
          path="/teacher/courses"
          element={isAuthenticated && role === 'Teacher' ? <TeacherCourses /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/lessons"
          element={isAuthenticated && role === 'Teacher' ? <TeacherLessons /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/assessments"
          element={isAuthenticated && role === 'Teacher' ? <TeacherAssessments /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/grades"
          element={isAuthenticated && role === 'Teacher' ? <TeacherGrades /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses/new"
          element={isAuthenticated && role === 'Teacher' ? <CourseForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/courses"
          element={isAuthenticated && role === 'Student' ? <StudentCourses /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/courses/:courseId/lessons"
          element={isAuthenticated && role === 'Student' ? <StudentLessons /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/courses/:courseId/assessments"
          element={isAuthenticated && role === 'Student' ? <StudentAssessments /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/grades"
          element={isAuthenticated && role === 'Student' ? <StudentGrades /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={isAuthenticated && role === 'Admin' ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/pending"
          element={isAuthenticated && role === 'Admin' ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher"
          element={isAuthenticated && role === 'Teacher' ? <TeacherPanel /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
