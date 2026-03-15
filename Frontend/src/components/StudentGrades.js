import React,{useEffect,useState} from 'react';
import api from '../services/api';

export default function StudentGrades(){

const [grades,setGrades]=useState([]);
const studentId=parseInt(localStorage.getItem('userId')||'0');

useEffect(()=>{

async function load(){

const res=await api.get(`/grades/mystudent/${studentId}`);
setGrades(res.data);

}

load();

},[studentId]);

return(

<div className="container mt-5">

<div className="card shadow border-0">

<div className="card-header text-white"
style={{
background:'linear-gradient(135deg,#8b5cf6,#7c3aed)'
}}>

<h4 className="mb-0">
My Grades
</h4>

</div>

<div className="card-body">

{grades.length===0 ?

<p>No grades recorded yet</p>

:

<table className="table table-striped">

<thead>
<tr>
<th>Assessment</th>
<th>Score</th>
</tr>
</thead>

<tbody>

{grades.map(g=>(

<tr key={g.gradeId}>
<td>{g.assessmentTitle || g.assessmentId}</td>
<td className="fw-bold">{g.score}</td>
</tr>

))}

</tbody>

</table>

}

</div>

</div>

</div>

);
}