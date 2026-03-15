using LMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssessmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AssessmentsController(ApplicationDbContext context) { _context = context; }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpPost("create")]
        public async Task<IActionResult> CreateAssessment(Assessment assessment)
        {
            if (User.IsInRole(UserRoles.Teacher))
            {
                var course = await _context.Courses.FindAsync(assessment.CourseId);
                if (course == null) return BadRequest("Course not found");
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
                if (course.TeacherId != userId) return Forbid();
            }
            _context.Assessments.Add(assessment);
            await _context.SaveChangesAsync();
            return Ok(assessment);
        }

        [HttpGet("bycourse/{courseId}")]
        public async Task<IActionResult> GetByCourse(int courseId)
        {
            var list = await _context.Assessments.Where(a => a.CourseId == courseId).ToListAsync();
            return Ok(list);
        }
    }
}