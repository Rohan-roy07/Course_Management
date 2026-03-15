using LMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LessonsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public LessonsController(ApplicationDbContext context) { _context = context; }

        private int CurrentUserId() {
            var id = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            return id != null ? int.Parse(id) : 0;
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpPost("create")]
        public async Task<IActionResult> CreateLesson(Lesson lesson)
        {
            // only teacher who owns course or admin can add
            if (User.IsInRole(UserRoles.Teacher))
            {
                var course = await _context.Courses.FindAsync(lesson.CourseId);
                if (course == null) return BadRequest("Course not found");
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);
                if (course.TeacherId != userId)
                {
                    // log details for debugging
                    Console.WriteLine($"Forbidden: teacher {userId} attempted to add lesson to course {lesson.CourseId} owned by {course.TeacherId}");
                    return Forbid();
                }
            }
            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();
            return Ok(lesson);
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLesson(int id, Lesson modified)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null) return NotFound();
            
            // check ownership
            var course = await _context.Courses.FindAsync(lesson.CourseId);
            if (course == null) return BadRequest("Course not found");
            
            if (User.IsInRole(UserRoles.Teacher))
            {
                var userId = CurrentUserId();
                if (course.TeacherId != userId)
                    return Forbid();
            }
            
            lesson.Title = modified.Title;
            lesson.LinkUrl = modified.LinkUrl;
            lesson.Notes = modified.Notes;
            lesson.FileUrl = modified.FileUrl;
            lesson.VideoUrl = modified.VideoUrl;
            
            await _context.SaveChangesAsync();
            return Ok(lesson);
        }

        [Authorize(Roles = UserRoles.Admin + "," + UserRoles.Teacher)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null) return NotFound();
            
            // check ownership
            var course = await _context.Courses.FindAsync(lesson.CourseId);
            if (course == null) return BadRequest("Course not found");
            
            if (User.IsInRole(UserRoles.Teacher))
            {
                var userId = CurrentUserId();
                if (course.TeacherId != userId)
                    return Forbid();
            }
            
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("bycourse/{courseId}")]
        public async Task<IActionResult> GetByCourse(int courseId)
        {
            var lessons = await _context.Lessons.Where(l => l.CourseId == courseId).ToListAsync();
            return Ok(lessons);
        }
    }
}
