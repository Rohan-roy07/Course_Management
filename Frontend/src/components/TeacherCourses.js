import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../AuthContext';

export default function TeacherCourses() {
  const { role } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  useEffect(() => {
    async function fetch() {
      const res = await api.get('/courses');
      if (role === 'Teacher') {
        const myId = parseInt(localStorage.getItem('userId') || '0');
        setCourses(res.data.filter(c => c.teacherId === myId));
      } else setCourses(res.data);
    }
    fetch();
  }, [role]);

  const handleCreate = async e => {
    e.preventDefault();
    await api.post('/courses/create', { title, description, imageUrl });
    setTitle(''); setDescription(''); setImageUrl('');
    const res = await api.get('/courses');
    setCourses(res.data);
  };

  const handleImageUpload = async (e, setImageFunc) => {
    const file = e.target.files[0];
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImageFunc(res.data.url);
    }
  };

  return (
    <div className="container mt-5 animate__animated animate__fadeIn">
      <h2>My Courses</h2>
      <form onSubmit={handleCreate} className="mb-4 p-3 border rounded bg-light">
        <div className="row">
          <div className="col-md-6">
            <input className="form-control mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
            <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Course Image:</label>
            <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => handleImageUpload(e, setImageUrl)} />
            {imageUrl && <img src={imageUrl} alt="Preview" style={{maxWidth: '100px', borderRadius: '4px'}} />}
          </div>
        </div>
        <button className="btn btn-success" type="submit">Add Course</button>
      </form>
      <div className="row">
        {courses.map(c => (
          <div key={c.courseId} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              {c.imageUrl && (
                <img src={c.imageUrl} className="card-img-top" alt={c.title} style={{height: '150px', objectFit: 'cover'}} />
              )}
              <div className="card-body">
                {editingId === c.courseId ? (
                  <div>
                    <input className="form-control mb-2" value={editTitle} onChange={e=>setEditTitle(e.target.value)} />
                    <textarea className="form-control mb-2" value={editDescription} onChange={e=>setEditDescription(e.target.value)} />
                    <label className="form-label">Change Image:</label>
                    <input type="file" className="form-control mb-2" accept="image/*" onChange={(e) => handleImageUpload(e, setEditImageUrl)} />
                    {editImageUrl && <img src={editImageUrl} alt="Preview" style={{maxWidth: '100px', borderRadius: '4px'}} />}
                    <div className="d-flex gap-2 mt-2">
                      <button className="btn btn-sm btn-primary" onClick={async () => {
                        await api.put(`/courses/${c.courseId}`, { title: editTitle, description: editDescription, imageUrl: editImageUrl || c.imageUrl });
                        const res = await api.get('/courses');
                        const myId = parseInt(localStorage.getItem('userId') || '0');
                        setCourses(res.data.filter(c2 => role !== 'Teacher' || c2.teacherId === myId));
                        setEditingId(null);
                        setEditImageUrl('');
                      }}>Save</button>
                      <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setEditImageUrl(''); }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h5 className="card-title">{c.title}</h5>
                    <p className="card-text text-muted small">{c.description}</p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                        setEditingId(c.courseId);
                        setEditTitle(c.title);
                        setEditDescription(c.description);
                        setEditImageUrl(c.imageUrl || '');
                      }}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={async () => {
                        if (window.confirm('Delete this course?')) {
                          await api.delete(`/courses/${c.courseId}`);
                          setCourses(courses.filter(x => x.courseId !== c.courseId));
                        }
                      }}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
