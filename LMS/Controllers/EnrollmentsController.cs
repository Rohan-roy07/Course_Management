using LMS.Data;
using LMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnrollmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public EnrollmentsController(ApplicationDbContext context) { _context = context; }

        [Authorize(Roles = UserRoles.Student + "," + UserRoles.Admin)]
        [HttpPost("enroll")]
        public async Task<IActionResult> Enroll(Enrollment enrollment)
        {
            // check duplicate
            bool exists = await _context.Enrollments
                .AnyAsync(e => e.StudentId == enrollment.StudentId && e.CourseId == enrollment.CourseId);
            if (exists) return BadRequest("Already enrolled");

            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
            return Ok(enrollment);
        }

        [Authorize(Roles = UserRoles.Student)]
        [HttpGet("mystudent/{studentId}")]
        public async Task<IActionResult> MyCourses(int studentId)
        {
            var list = await _context.Enrollments.Where(e => e.StudentId == studentId).ToListAsync();
            return Ok(list);
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpGet("bycourse/{courseId}")]
        public async Task<IActionResult> ByCourse(int courseId)
        {
            var list = await _context.Enrollments.Where(e => e.CourseId == courseId).ToListAsync();
            return Ok(list);
        }
    }
}