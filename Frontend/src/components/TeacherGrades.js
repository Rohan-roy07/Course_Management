import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function TeacherGrades() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get('/courses');
      const myId = parseInt(localStorage.getItem('userId') || '0');
      setCourses(res.data.filter(c => c.teacherId === myId));
    }
    load();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      api.get(`/assessments/bycourse/${selectedCourse}`).then(r => setAssessments(r.data));
      api.get(`/enrollments/bycourse/${selectedCourse}`).then(r => setEnrollments(r.data));
    } else {
      setAssessments([]);
      setEnrollments([]);
      setGrades([]);
    }
    setSelectedAssessment(null);
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedAssessment) {
      api.get(`/grades/byassessment/${selectedAssessment}`).then(r => setGrades(r.data));
    } else {
      setGrades([]);
    }
  }, [selectedAssessment]);

  const setGrade = async (studentId, score) => {
    const existing = grades.find(g => g.studentId === studentId);
    if (existing) return;

    await api.post('/grades/grade', { studentId, assessmentId: selectedAssessment, score });

    const r = await api.get(`/grades/byassessment/${selectedAssessment}`);
    setGrades(r.data);
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">

      <div className="card shadow border-0">
        <div className="card-body">

          <h2>Grade Students</h2>

          <div className="mb-3">
            <label className="form-label">Course</label>

            <select
              className="form-select"
              value={selectedCourse || ''}
              onChange={e => setSelectedCourse(parseInt(e.target.value) || null)}
            >
              <option value="">-- choose --</option>

              {courses.map(c => (
                <option key={c.courseId} value={c.courseId}>{c.title}</option>
              ))}

            </select>

          </div>

          {selectedCourse && (
            <>
              <div className="mb-3">

                <label className="form-label">Assessment</label>

                <select
                  className="form-select"
                  value={selectedAssessment || ''}
                  onChange={e => setSelectedAssessment(parseInt(e.target.value) || null)}
                >
                  <option value="">-- choose --</option>

                  {assessments.map(a => (
                    <option key={a.assessmentId} value={a.assessmentId}>{a.title}</option>
                  ))}

                </select>

              </div>

              {selectedAssessment && (

                <table className="table table-striped table-hover">

                  <thead className="table-dark">
                    <tr>
                      <th>Student ID</th>
                      <th>Score</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {enrollments.map(e => {

                      const existing = grades.find(g => g.studentId === e.studentId);

                      return (
                        <tr key={e.enrollmentId}>

                          <td>{e.studentId}</td>

                          <td>{existing ? existing.score : '-'}</td>

                          <td>

                            {!existing && (

                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  const s = prompt('Enter score');
                                  if (s != null) setGrade(e.studentId, parseInt(s));
                                }}
                              >
                                Grade
                              </button>

                            )}

                          </td>

                        </tr>
                      );

                    })}

                  </tbody>

                </table>

              )}

            </>
          )}

        </div>
      </div>

    </div>
  );
}