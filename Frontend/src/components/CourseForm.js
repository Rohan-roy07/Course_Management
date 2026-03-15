import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CourseForm() {

  const [title,setTitle]=useState('');
  const [description,setDescription]=useState('');
  const [imageUrl,setImageUrl]=useState('');

  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    await api.post('/courses',{title,description,imageUrl});
    navigate('/courses');
  };

  const handleImageUpload=async(e)=>{
    const file=e.target.files[0];
    const fd=new FormData();
    fd.append('file',file);

    const res=await api.post('/files/upload',fd,{
      headers:{'Content-Type':'multipart/form-data'}
    });

    setImageUrl(res.data.url);
  };

  return(

<div className="container mt-5" style={{maxWidth:'650px'}}>

<div className="card shadow-lg border-0">

<div className="card-header text-white"
style={{background:'linear-gradient(135deg,#10b981,#059669)'}}>
<h4>Create New Course</h4>
</div>

<div className="card-body">

<form onSubmit={handleSubmit}>

<div className="mb-3">
<label className="form-label">Course Title</label>
<input className="form-control"
value={title}
onChange={e=>setTitle(e.target.value)}
required/>
</div>

<div className="mb-3">
<label className="form-label">Description</label>
<textarea className="form-control"
rows="3"
value={description}
onChange={e=>setDescription(e.target.value)}
required/>
</div>

<div className="mb-3">
<label className="form-label">Upload Image</label>
<input type="file"
className="form-control"
onChange={handleImageUpload}/>
</div>

{imageUrl && (
<div className="text-center mb-3">
<img src={imageUrl}
style={{maxWidth:'220px',borderRadius:'10px'}}/>
</div>
)}

<button className="btn btn-success w-100">
Create Course
</button>

</form>

</div>
</div>
</div>
);
}