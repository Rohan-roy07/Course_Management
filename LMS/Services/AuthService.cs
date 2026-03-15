using LMS;
using LMS.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LMS.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthService(UserManager<ApplicationUser> userManager,
                           RoleManager<IdentityRole<int>> roleManager,
                           IConfiguration configuration,
                           ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        public async Task<(int, string)> Register(User model, string role)
        {
            if (await _userManager.FindByEmailAsync(model.Email) != null)
                return (0, "User already exists");

            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole<int>(role));

            var identityUser = new ApplicationUser
            {
                Email = model.Email,
                UserName = model.Username,
                Name = model.Username
            };

            var result = await _userManager.CreateAsync(identityUser, model.Password);
            if (!result.Succeeded)
            {
                // log errors for debugging
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                Console.WriteLine("Identity creation failed: " + errors);
                return (0, "User creation failed: " + errors);
            }

            await _userManager.AddToRoleAsync(identityUser, role);

            var customUser = new User
            {
                // don't assign UserId - let it be generated
                IdentityId = identityUser.Id,
                Email = model.Email,
                Username = model.Username,
                UserRole = role,
                Password = identityUser.PasswordHash ?? "",
                IsApproved = role == UserRoles.Student
            };

            _context.Users.Add(customUser);
            await _context.SaveChangesAsync();

            return (1, "User created successfully");
        }

        public async Task<(int, object)> Login(LoginModel model)
        {
            var identityUser = await _userManager.FindByEmailAsync(model.Email);
            if (identityUser == null) return (0, "Invalid email");

            var passOk = await _userManager.CheckPasswordAsync(identityUser, model.Password);
            if (!passOk) return (0, "Invalid password");

            var customUser = await _context.Users.FirstOrDefaultAsync(u => u.IdentityId == identityUser.Id);
            if (customUser == null) return (0, "User profile not found");

            if (customUser.UserRole == UserRoles.Teacher && !customUser.IsApproved)
                return (0, "Teacher approval pending from admin");

            var claims = new List<Claim> {
                new Claim(ClaimTypes.NameIdentifier, identityUser.Id.ToString()),
                new Claim(ClaimTypes.Name, customUser.Username),
                new Claim(ClaimTypes.Role, customUser.UserRole),
                new Claim("email", customUser.Email)
            };

            var token = GenerateToken(claims);

            return (1, new { token, role = customUser.UserRole, userName = customUser.Username, id = identityUser.Id });
        }

        private string GenerateToken(IEnumerable<Claim> claims) {
            var jwtSection = _configuration.GetSection("JWT");
            var secret = jwtSection["Key"];
            var issuer = jwtSection["Issuer"];
            var audience = jwtSection["Audience"];

            if (string.IsNullOrEmpty(secret))
                throw new InvalidOperationException("JWT Key is missing in configuration.");

            var keyBytes = Encoding.UTF8.GetBytes(secret);
            if (keyBytes.Length < 32) // 256 bits
                throw new InvalidOperationException("JWT Key must be at least 256 bits (32 bytes); current length " + keyBytes.Length);

            var signingKey = new SymmetricSecurityKey(keyBytes);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddHours(6),
                claims: claims,
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
