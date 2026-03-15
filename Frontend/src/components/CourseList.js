import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import api from '../services/api';

export default function CourseList(){

const [courses,setCourses]=useState([]);

useEffect(()=>{
async function fetchCourses(){
const res=await api.get('/courses');
setCourses(res.data);
}
fetchCourses();
},[]);

return(

<div className="container mt-5">

<h2 className="mb-4 fw-bold text-primary">Explore Courses</h2>

<div className="row">

{courses.map(c=>(
<div key={c.courseId} className="col-md-6 col-lg-4 mb-4">

<div className="card border-0 shadow-lg h-100"
style={{transition:'0.3s'}}>

{c.imageUrl &&
<img src={c.imageUrl}
className="card-img-top"
style={{height:'180px',objectFit:'cover'}}/>}

<div className="card-body">

<h5 className="fw-bold">{c.title}</h5>

<p className="text-muted small">
{c.description}
</p>



</div>

</div>

</div>
))}

</div>
</div>
);
}