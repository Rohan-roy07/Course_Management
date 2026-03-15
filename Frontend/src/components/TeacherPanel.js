import React from 'react';
import { Link } from 'react-router-dom';

export default function TeacherPanel() {
  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      
      <div className="card shadow border-0">
        <div className="card-body">

          <h2 className="card-title mb-3">Teacher Dashboard</h2>
          <p className="text-muted">
            Use the navigation links or the list below to manage your courses, lessons, assessments, and student grades.
          </p>

          <ul className="list-group list-group-flush mt-3">

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link to="/teacher/courses" className="text-decoration-none fw-semibold">
                Create / Update Courses
              </Link>
              <span className="badge bg-primary">Courses</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link to="/teacher/lessons" className="text-decoration-none fw-semibold">
                Add Lessons
              </Link>
              <span className="badge bg-success">Lessons</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link to="/teacher/assessments" className="text-decoration-none fw-semibold">
                Create Assessments
              </Link>
              <span className="badge bg-warning text-dark">Assessments</span>
            </li>

            <li className="list-group-item d-flex justify-content-between align-items-center">
              <Link to="/teacher/grades" className="text-decoration-none fw-semibold">
                Grade Students
              </Link>
              <span className="badge bg-danger">Grades</span>
            </li>

          </ul>

        </div>
      </div>

    </div>
  );
}