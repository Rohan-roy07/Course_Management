using LMS;
using LMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = UserRoles.Admin)]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("pending-teachers")]
        public async Task<IActionResult> PendingTeachers() {
            var pending = await _context.Users
                .Where(u => u.UserRole == UserRoles.Teacher && !u.IsApproved)
                .ToListAsync();
            return Ok(pending);
        }

        [HttpPut("approve-teacher/{id}")]
        public async Task<IActionResult> ApproveTeacher(int id) {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id && u.UserRole == UserRoles.Teacher);
            if (user == null) return NotFound();
            user.IsApproved = true;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Teacher approved" });
        }
    }
}
