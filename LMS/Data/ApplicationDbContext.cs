using LMS.Models;
using LMS.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LMS
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public new DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Assessment> Assessments { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<User>()
                   .HasIndex(u => u.Email).IsUnique();
            builder.Entity<User>()
                   .HasIndex(u => u.IdentityId).IsUnique();
            // UserId remains identity so EF will generate it automatically
            // previously we attempted to overwrite it, causing errors

            builder.Entity<Enrollment>()
                   .HasIndex(e => new { e.StudentId, e.CourseId })
                   .IsUnique();

        }
    }
}

