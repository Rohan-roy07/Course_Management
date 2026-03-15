using LMS;
using LMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CoursesController(ApplicationDbContext context) { _context = context; }

        private int CurrentUserId() {
            var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return id != null ? int.Parse(id) : 0;
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCourse(Course course) {
            // if teacher creating a course, set TeacherId from token
            if (User.IsInRole(UserRoles.Teacher)) {
                course.TeacherId = CurrentUserId();
            }
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return Ok(course);
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, Course modified) {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();
            if (User.IsInRole(UserRoles.Teacher) && course.TeacherId != CurrentUserId())
                return Forbid();
            course.Title = modified.Title;
            course.Description = modified.Description;
            course.ImageUrl = modified.ImageUrl;
            // teachers cannot change TeacherId
            await _context.SaveChangesAsync();
            return Ok(course);
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id) {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return NotFound();
            if (User.IsInRole(UserRoles.Teacher) && course.TeacherId != CurrentUserId())
                return Forbid();
            
            // Delete related data first (cascade delete)
            var courseId = course.CourseId;
            
            // Delete grades for assessments of this course
            var assessments = await _context.Assessments.Where(a => a.CourseId == courseId).ToListAsync();
            var assessmentIds = assessments.Select(a => a.AssessmentId).ToList();
            var grades = await _context.Grades.Where(g => assessmentIds.Contains(g.AssessmentId)).ToListAsync();
            _context.Grades.RemoveRange(grades);
            
            // Delete assessments
            _context.Assessments.RemoveRange(assessments);
            
            // Delete lessons
            var lessons = await _context.Lessons.Where(l => l.CourseId == courseId).ToListAsync();
            _context.Lessons.RemoveRange(lessons);
            
            // Delete enrollments
            var enrollments = await _context.Enrollments.Where(e => e.CourseId == courseId).ToListAsync();
            _context.Enrollments.RemoveRange(enrollments);
            
            // Delete the course
            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses() {
            var courses = await _context.Courses.ToListAsync();
            return Ok(courses);
        }
    }
}
