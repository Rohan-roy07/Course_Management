using System.Text;
using LMS;
using LMS.Models;
using LMS.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure request size limit for file uploads (e.g., 500MB)
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 524288000; // 500MB
});

// register Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddIdentityCore<ApplicationUser>(options => {
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 8;
    })
    .AddRoles<IdentityRole<int>>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]!)
            ),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        };
    });

builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReact",
            policy => policy.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod());
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// Seed Admin role + user
using (var scope = app.Services.CreateScope()) {
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (!await roleManager.RoleExistsAsync(UserRoles.Admin)) {
        await roleManager.CreateAsync(new IdentityRole<int>(UserRoles.Admin));
    }

    var adminEmail = "admin@lms.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null) {
        adminUser = new ApplicationUser { Email = adminEmail, UserName = "admin", Name = "System Admin" };
        var result = await userManager.CreateAsync(adminUser, "Admin@12345");
        if (result.Succeeded) {
            await userManager.AddToRoleAsync(adminUser, UserRoles.Admin);
            // create custom user record with IdentityId
            db.Users.Add(new User {
                UserId = adminUser.Id,            // primary key value
                IdentityId = adminUser.Id,        // link back to AspNetUsers
                Email = adminEmail,
                Username = "admin",
                UserRole = UserRoles.Admin,
                IsApproved = true
            });
            await db.SaveChangesAsync();
        }
    } else {
        // ensure custom Users table has a matching entry and the IdentityId is correct
        var existing = await db.Users.FirstOrDefaultAsync(u => u.Email == adminEmail);
        if (existing == null) {
            db.Users.Add(new User {
                IdentityId = adminUser.Id,
                Email = adminEmail,
                Username = "admin",
                UserRole = UserRoles.Admin,
                IsApproved = true
            });
            await db.SaveChangesAsync();
        } else if (existing.IdentityId != adminUser.Id) {
            existing.IdentityId = adminUser.Id;
            db.Users.Update(existing);
            await db.SaveChangesAsync();
        }
    }
}

// enable swagger middleware in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
