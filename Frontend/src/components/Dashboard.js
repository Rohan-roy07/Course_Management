import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  const { role, userName } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {

    if(role==='Admin') navigate('/admin');
    else if(role==='Teacher') navigate('/teacher');
    else if(role==='Student') navigate('/student/courses');

  },[role,navigate]);

  return (

<div className="container mt-5">

<div className="p-5 rounded text-center text-white shadow"
style={{
background:'linear-gradient(135deg,#6366f1,#4f46e5)'
}}>

<h1 className="fw-bold">Welcome {userName}</h1>

<p className="lead">

{role==='Admin' && "Redirecting to admin dashboard..."}
{role==='Teacher' && "Opening teacher workspace..."}
{role==='Student' && "Loading courses for you..."}

</p>

</div>

</div>
  );
}