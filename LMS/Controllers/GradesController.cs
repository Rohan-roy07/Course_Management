using LMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public GradesController(ApplicationDbContext context) { _context = context; }

        [Authorize(Roles = UserRoles.Teacher + "," + UserRoles.Admin)]
        [HttpPost("grade")]
        public async Task<IActionResult> GradeStudent(Grade grade)
        {
            // ensure teacher owns the course of the assessment
            if (User.IsInRole(UserRoles.Teacher))
            {
                var assessment = await _context.Assessments.FindAsync(grade.AssessmentId);
                if (assessment == null) return BadRequest("Assessment not found");
                var course = await _context.Courses.FindAsync(assessment.CourseId);
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
                if (course.TeacherId != userId) return Forbid();
            }
            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();
            return Ok(grade);
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpGet("byassessment/{assessmentId}")]
        public async Task<IActionResult> ByAssessment(int assessmentId)
        {
            var list = await _context.Grades.Where(g => g.AssessmentId == assessmentId).ToListAsync();
            return Ok(list);
        }

        [Authorize(Roles = UserRoles.Student)]
        [HttpGet("mystudent/{studentId}")]
        public async Task<IActionResult> MyGrades(int studentId)
        {
            var grades = await _context.Grades.Where(g => g.StudentId == studentId).ToListAsync();
            return Ok(grades);
        }
    }
}