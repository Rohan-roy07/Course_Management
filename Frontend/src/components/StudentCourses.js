import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function StudentCourses() {

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [details, setDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const studentId = parseInt(localStorage.getItem('userId') || '0');

  useEffect(() => {
    async function load(){
      const res = await api.get('/courses');
      setCourses(res.data);

      const enr = await api.get(`/enrollments/mystudent/${studentId}`);
      setEnrolled(enr.data.map(e=>e.courseId));
    }
    load();
  }, [studentId]);

  const enroll = async (courseId) => {
    await api.post('/enrollments/enroll', { studentId, courseId });
    setEnrolled([...enrolled, courseId]);
  };

  const showDetails = async (courseId) => {
    if (details[courseId]) return;

    const lessons = await api.get(`/lessons/bycourse/${courseId}`);
    const assessments = await api.get(`/assessments/bycourse/${courseId}`);

    setDetails({
      ...details,
      [courseId]: {
        lessons: lessons.data,
        assessments: assessments.data
      }
    });
  };

  return (

    <div className="container mt-5">

      <h2 className="mb-4 text-primary fw-bold">
        Available Courses
      </h2>

      <div className="mb-4">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search courses by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {courses.filter(c => 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      ).length === 0 ? (
        <div className="alert alert-info">
          {searchTerm ? 'No courses found matching your search.' : 'No courses available.'}
        </div>
      ) : (

      <div className="row">

        {courses.filter(c => 
          c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(c => (

          <div key={c.courseId} className="col-md-6 col-lg-4 mb-4">

            <div className="card h-100 shadow border-0">

              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  className="card-img-top"
                  alt={c.title}
                  style={{height:'180px', objectFit:'cover'}}
                />
              )}

              <div className="card-body d-flex flex-column">

                <h5 className="card-title fw-bold">
                  {c.title}
                </h5>

                <p className="card-text text-muted">
                  {c.description}
                </p>

                {enrolled.includes(c.courseId) ? (

                  <div className="mt-auto">

                    <span className="badge bg-success mb-2">
                      Enrolled
                    </span>

                    <div className="d-flex gap-2 flex-wrap mb-2">

                      <a
                        className="btn btn-sm btn-outline-primary"
                        href={`/student/courses/${c.courseId}/lessons`}
                      >
                        Lessons
                      </a>

                      <a
                        className="btn btn-sm btn-outline-secondary"
                        href={`/student/courses/${c.courseId}/assessments`}
                      >
                        Assessments
                      </a>

                      <button
                        className="btn btn-sm btn-link"
                        onClick={() => showDetails(c.courseId)}
                      >
                        Show titles
                      </button>

                    </div>

                    {details[c.courseId] && (

                      <div className="mt-2 border-top pt-2">

                        <strong>Lessons:</strong>

                        <ul className="small">
                          {details[c.courseId].lessons.map(l => (
                            <li key={l.lessonId}>
                              {l.title}
                            </li>
                          ))}
                        </ul>

                        <strong>Assessments:</strong>

                        <ul className="small">
                          {details[c.courseId].assessments.map(a => (
                            <li key={a.assessmentId}>
                              {a.title}
                            </li>
                          ))}
                        </ul>

                      </div>

                    )}

                  </div>

                ) : (

                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => enroll(c.courseId)}
                  >
                    Enroll
                  </button>

                )}

              </div>

            </div>

          </div>

        ))}

      </div>
      )}

    </div>
  );
}
