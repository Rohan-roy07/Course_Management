import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function TeacherAssessments() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    async function load() {
      const res = await api.get('/courses');
      const myId = parseInt(localStorage.getItem('userId') || '0');
      setCourses(res.data.filter(c => c.teacherId === myId));
    }
    load();
  }, []);

  useEffect(() => {
    if (selected) {
      api.get(`/assessments/bycourse/${selected}`).then(r => setAssessments(r.data));
    } else {
      setAssessments([]);
    }
  }, [selected]);

  const add = async e => {
    e.preventDefault();
    await api.post('/assessments/create', { courseId: selected, title, instructions });
    setTitle('');
    setInstructions('');
    const r = await api.get(`/assessments/bycourse/${selected}`);
    setAssessments(r.data);
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">

      <div className="card shadow border-0 mb-4">
        <div className="card-body">

          <h2>Assessments</h2>

          <div className="mb-3">
            <label className="form-label">Select Course</label>

            <select
              className="form-select"
              value={selected || ''}
              onChange={e => setSelected(parseInt(e.target.value) || null)}
            >
              <option value="">-- choose --</option>
              {courses.map(c => (
                <option key={c.courseId} value={c.courseId}>{c.title}</option>
              ))}
            </select>

          </div>

        </div>
      </div>

      {selected && (
        <>
          <div className="card shadow border-0 mb-4">
            <div className="card-body">

              <form onSubmit={add}>

                <input
                  className="form-control mb-2"
                  placeholder="Assessment title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Instructions or link"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                />

                <button className="btn btn-primary">
                  Create Assessment
                </button>

              </form>

            </div>
          </div>

          <div className="card shadow border-0">
            <ul className="list-group list-group-flush">

              {assessments.map(a => (
                <li key={a.assessmentId} className="list-group-item">
                  {a.title}
                </li>
              ))}

            </ul>
          </div>
        </>
      )}

    </div>
  );
}