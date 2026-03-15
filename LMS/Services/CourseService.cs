using LMS;
using LMS.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.Services
{
    public class CourseService
    {
        private readonly ApplicationDbContext _context;
        public CourseService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Course>> GetAllCourses() {
            return await _context.Courses.ToListAsync();
        }

        public async Task<Course?> GetCourseById(int id) {
            return await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == id);
        }

        public async Task<bool> AddCourse(Course course) {
            await _context.Courses.AddAsync(course);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateCourse(int id, Course updatedCourse) {
            var existing = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == id);
            if (existing == null) return false;

            existing.Title = updatedCourse.Title;
            existing.Description = updatedCourse.Description;
            existing.TeacherId = updatedCourse.TeacherId;

            _context.Courses.Update(existing);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteCourse(int id) {
            var existing = await _context.Courses.FirstOrDefaultAsync(c => c.CourseId == id);
            if (existing == null) return false;

            _context.Courses.Remove(existing);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
