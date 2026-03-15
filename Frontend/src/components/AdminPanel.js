import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminPanel() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get('/admin/pending-teachers');
      setPending(res.data);
    }
    load();
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/approve-teacher/${id}`);
    setPending(pending.filter(p => p.userId !== id));
  };

  return (
    <div className="container mt-5">

      <div className="p-4 mb-4 rounded text-white"
        style={{background:'linear-gradient(135deg,#4f46e5,#3b82f6)'}}>
        <h2 className="fw-bold">Admin Dashboard</h2>
        <p className="mb-0">Manage teachers and system settings</p>
      </div>

      <div className="card shadow-lg border-0">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Pending Teacher Approvals</h5>
        </div>

        <div className="card-body">

          {pending.length === 0 ? (
            <div className="alert alert-success">
              No teachers awaiting approval.
            </div>
          ) : (

            <ul className="list-group list-group-flush">

              {pending.map(u => (
                <li key={u.userId}
                  className="list-group-item d-flex justify-content-between align-items-center">

                  <div>
                    <strong>{u.username}</strong>
                    <div className="text-muted small">{u.email}</div>
                  </div>

                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => approve(u.userId)}>
                    Approve
                  </button>

                </li>
              ))}

            </ul>
          )}

        </div>
      </div>
    </div>
  );
}