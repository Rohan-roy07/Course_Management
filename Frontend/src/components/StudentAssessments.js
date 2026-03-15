import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../services/api';

export default function StudentAssessments(){

const {courseId}=useParams();
const [assessments,setAssessments]=useState([]);

useEffect(()=>{

async function load(){
const res=await api.get(`/assessments/bycourse/${courseId}`);
setAssessments(res.data);
}

load();

},[courseId]);

return(
    <>
<NavigationBar />
<div className="container mt-5">

<h2 className="mb-4 fw-bold text-danger">
Course Assessments
</h2>

{assessments.length===0 ?

<div className="alert alert-secondary">
No assessments available
</div>

:

assessments.map(a=>(

<div key={a.assessmentId}
className="card shadow-sm border-0 mb-3">

<div className="card-body">

<h5 className="fw-bold">{a.title}</h5>

{a.instructions ?

<a
href={a.instructions}
target="_blank"
rel="noreferrer"
className="btn btn-outline-danger btn-sm">

View Instructions

</a>

:

<p className="text-muted">
No instructions provided
</p>

}

</div>
</div>

))
}

</div>
</>
);
}