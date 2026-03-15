import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function TeacherLessons() {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [editingId, setEditingId] = useState(null);

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
      api.get(`/lessons/bycourse/${selected}`).then(r => setLessons(r.data));
    } else {
      setLessons([]);
    }
  }, [selected]);

  const resetForm = () => {
    setTitle('');
    setLinkUrl('');
    setNotes('');
    setFileUrl('');
    setVideoUrl('');
    setEditingId(null);
  };

  const add = async e => {
    e.preventDefault();
    await api.post('/lessons/create', { courseId: selected, title, linkUrl, notes, fileUrl, videoUrl });
    resetForm();
    const r = await api.get(`/lessons/bycourse/${selected}`);
    setLessons(r.data);
  };

  const update = async e => {
    e.preventDefault();
    await api.put(`/lessons/${editingId}`, { lessonId: editingId, courseId: selected, title, linkUrl, notes, fileUrl, videoUrl });
    resetForm();
    const r = await api.get(`/lessons/bycourse/${selected}`);
    setLessons(r.data);
  };

  const deleteLesson = async (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      await api.delete(`/lessons/${id}`);
      const r = await api.get(`/lessons/bycourse/${selected}`);
      setLessons(r.data);
    }
  };

  const startEdit = (lesson) => {
    setEditingId(lesson.lessonId);
    setTitle(lesson.title);
    setLinkUrl(lesson.linkUrl || '');
    setNotes(lesson.notes || '');
    setFileUrl(lesson.fileUrl || '');
    setVideoUrl(lesson.videoUrl || '');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFileUrl(res.data.url);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setVideoUrl(res.data.url);
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <h2>Lessons</h2>
      <div className="mb-3">
        <label>Select Course</label>
        <select className="form-control" value={selected || ''} onChange={e => { setSelected(parseInt(e.target.value) || null); resetForm(); }}>
          <option value="">-- choose --</option>
          {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.title}</option>)}
        </select>
      </div>
      {selected && (
        <>
          <form onSubmit={editingId ? update : add} className="mb-3 p-3 border rounded bg-light">
            <h5>{editingId ? 'Edit Lesson' : 'Add New Lesson'}</h5>
            <input className="form-control mb-2" placeholder="Lesson title" value={title} onChange={e=>setTitle(e.target.value)} required />
            <input className="form-control mb-2" placeholder="Link URL" value={linkUrl} onChange={e=>setLinkUrl(e.target.value)} />
            <textarea className="form-control mb-2" placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
            <div className="mb-2">
              <label className="form-label">Upload File:</label>
              <input type="file" className="form-control" onChange={handleImageUpload} />
              {fileUrl && <p className="mt-1 text-success">File uploaded: {fileUrl}</p>}
            </div>
            <div className="mb-2">
              <label className="form-label">Upload Video:</label>
              <input type="file" className="form-control" accept="video/*" onChange={handleVideoUpload} />
              {videoUrl && <p className="mt-1 text-success">Video uploaded: {videoUrl}</p>}
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add Lesson'}</button>
              {editingId && (
                <button className="btn btn-secondary" type="button" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
          <ul className="list-group">
            {lessons.map(l => (
              <li key={l.lessonId} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{l.title}</strong>
                  {l.linkUrl && <div className="small text-muted">Link: <a href={l.linkUrl} target="_blank" rel="noreferrer">{l.linkUrl}</a></div>}
                  {l.notes && <div className="small">Notes: {l.notes}</div>}
                  {l.fileUrl && <div className="small">File: <a href={l.fileUrl} target="_blank" rel="noreferrer">{l.fileUrl}</a></div>}
                  {l.videoUrl && <div className="small">Video: <a href={l.videoUrl} target="_blank" rel="noreferrer">{l.videoUrl}</a></div>}
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(l)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteLesson(l.lessonId)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

