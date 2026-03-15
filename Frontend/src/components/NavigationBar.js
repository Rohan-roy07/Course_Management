import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function NavigationBar() {
  const { role, userName, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
<nav className="navbar navbar-expand-lg" style={{  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)' }}>
      <div className="container">
        <Link className="navbar-brand" to="/">LMS</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {role && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/courses">Courses</Link>
              </li>
              {role === 'Admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
              {role === 'Teacher' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/teacher">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/teacher/courses">Courses</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/teacher/lessons">Lessons</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/teacher/assessments">Assessments</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/teacher/grades">Grades</Link>
                  </li>
                </>
              )}
              {role === 'Student' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/student/courses">Browse</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/student/grades">My Grades</Link>
                  </li>
                </>
              )}
            </ul>
          )}
          {role ? (
            <span className="navbar-text text-light">
              Hello, {userName}! &nbsp;
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => { logout(); navigate('/login'); }}
              >
                Logout
              </button>
            </span>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">Sign Up</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
