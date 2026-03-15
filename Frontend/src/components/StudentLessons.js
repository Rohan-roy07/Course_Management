import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function StudentLessons() {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/lessons/bycourse/${courseId}`);
      setLessons(res.data);
    }
    load();
  }, [courseId]);

  return (
    <div className="container mt-5">

      <div
        className="text-white p-4 rounded-4 shadow-lg mb-5 text-center"
        style={{background:"linear-gradient(135deg,#2563eb,#4f46e5)"}}
      >
        <h2 className="fw-bold">🎬 Course Playlist</h2>
        <p className="mb-0 opacity-75">
          Watch and explore lessons for this course
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="alert alert-info text-center shadow-sm rounded-4">
          📭 No lessons available.
        </div>
      ) : (
        <div className="row g-4">

          {lessons.map((l, index) => (

            <div key={l.lessonId} className="col-12">

              <div
                className="card border-0 shadow-lg "
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "all .3s"
                }}
              >

                <div className="row g-0">

                  {/* Video Section */}
                  <div className="col-md-7 bg-dark position-relative">

                    <span
                      className="badge bg-danger position-absolute top-0 start-0  px-3 py-2"
                    >
                      Lesson {index + 1}
                    </span>

                    {l.videoUrl ? (
                      <video
                        controls
                        className="w-100  h-responsive"
                        style={{
                          height:"200px",
                          objectFit:"cover"
                        }}
                        src={l.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="text-white text-center p-5">
                        <i className="bi bi-play-circle fs-1"></i>
                        <p className="small mt-2 mb-0">Lesson Preview</p>
                      </div>
                    )}

                  </div>

                  {/* Lesson Info */}
                  <div className="col-md-5">

                    <div className="card-body d-flex flex-column h-100">

                      <h4 className="fw-bold mb-2">
                        {l.title}
                      </h4>

                      <span className="badge bg-primary-subtle text-primary mb-2">
                        📘 Learning Lesson
                      </span>

                      {l.notes && (
                        <p className="text-muted small">
                          {l.notes}
                        </p>
                      )}

                      {l.linkUrl ? (
                        l.linkUrl.startsWith('http') ? (
                          <a
                            href={l.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary btn-sm mb-2"
                          >
                            🔗 Open Resource
                          </a>
                        ) : (
                          <p className="text-muted small">
                            {l.linkUrl}
                          </p>
                        )
                      ) : null}

                      {l.fileUrl && (
                        <a
                          href={`http://localhost:8080/api/files/download?fileName=${encodeURIComponent(l.fileUrl.split('/uploads/')[1] || l.fileUrl)}`}
                          download
                          className="btn btn-success btn-sm mt-auto"
                        >
                          ⬇ Download Material
                        </a>
                      )}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}