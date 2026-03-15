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
  const { role } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  return (
    <div className="App">
      <NavigationBar />
      <Routes>
        <Route
          path="/"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/courses"
          element={token ? <CourseList /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/courses"
          element={token && role === 'Teacher' ? <TeacherCourses /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/lessons"
          element={token && role === 'Teacher' ? <TeacherLessons /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/assessments"
          element={token && role === 'Teacher' ? <TeacherAssessments /> : <Navigate to="/login" />}
        />
        <Route
          path="/teacher/grades"
          element={token && role === 'Teacher' ? <TeacherGrades /> : <Navigate to="/login" />}
        />
        <Route
          path="/courses/new"
          element={token && role === 'Teacher' ? <CourseForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/courses"
          element={token && role === 'Student' ? <StudentCourses /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/courses/:courseId/lessons"
          element={token && role === 'Student' ? <StudentLessons /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/courses/:courseId/assessments"
          element={token && role === 'Student' ? <StudentAssessments /> : <Navigate to="/login" />}
        />
        <Route
          path="/student/grades"
          element={token && role === 'Student' ? <StudentGrades /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={token && role === 'Admin' ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/pending"
          element={token && role === 'Admin' ? <AdminPanel /> : <Navigate to="/" />}
        />
        <Route
          path="/teacher"
          element={token && role === 'Teacher' ? <TeacherPanel /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
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
